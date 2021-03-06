import { writable } from 'svelte/store';
export const user = writable();

export async function signOut() {
	localStorage.removeItem('id_token');
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
	return await getProfile();
}

export async function signIn(email, pwd) {
	const signIn_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/account/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			password: pwd
		})
	});
	let data = await signIn_result.json();

	if (signIn_result.ok) {
		localStorage.setItem('id_token', data.AuthenticationResult.IdToken);
		localStorage.setItem('access_token', data.AuthenticationResult.AccessToken);
		localStorage.setItem('refresh_token', data.AuthenticationResult.RefreshToken);
		let userData = parseJwt(data.AuthenticationResult.IdToken);
		user.set(userData);
	} else {
		throw new Error(data.__type);
	}
}

export async function signUp(userInfo) {
	const signUp_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/account/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userInfo)
	});
	let data = await signUp_result.json();

	if (signUp_result.ok) {
		localStorage.setItem('tmp_email', userInfo.email);
		localStorage.setItem('tmp_pwd', userInfo.password);
		return (window.location.href = '/confirm');
	} else {
		throw new Error(JSON.stringify(data));
	}
}

export async function forgotPassword(email) {
	const result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/account/forgot`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email: email })
	});
	let data = await result.json();

	if (result.ok) {
		console.log(JSON.stringify(data));
		localStorage.setItem('tmp_email', email);
		return (window.location.href = '/confirm-forgot');
	} else {
		throw new Error(JSON.stringify(data));
	}
}

export async function confirmForgotPassword(code, password) {
	const confirm_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/account/forgot`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: localStorage.getItem('tmp_email'),
			password: password,
			code: code
		})
	});
	let data = await confirm_result.json();

	if (confirm_result.ok) {
		let usr = localStorage.getItem('tmp_email');
		localStorage.removeItem('tmp_email');
		await signIn(usr, password);
		return (window.location.href = '/');
	} else {
		throw new Error(JSON.stringify(data));
	}
}

export async function confirm(code) {
	const confirm_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/account/confirm`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: localStorage.getItem('tmp_email'),
			code: code
		})
	});
	let data = await confirm_result.json();

	if (confirm_result.ok) {
		let usr = localStorage.getItem('tmp_email');
		let pwd = localStorage.getItem('tmp_pwd');
		localStorage.removeItem('tmp_email');
		localStorage.removeItem('tmp_pwd');
		await signIn(usr, pwd);
		return (window.location.href = '/');
	} else {
		throw new Error(JSON.stringify(data));
	}
}

export async function resendCode() {
	const resendCode_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/account/confirm`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: localStorage.getItem('tmp_email')
		})
	});
	let data = await resendCode_result.json();

	if (resendCode_result.ok) {
		console.log(JSON.stringify(data));
		return data.CodeDeliveryDetails.Destination;
	} else {
		throw new Error(JSON.stringify(data));
	}
}

async function refreshTokens() {
	const refreshTokens_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/account/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			refresh_token: localStorage.getItem('refresh_token')
		})
	});

	let data = await refreshTokens_result.json();

	if (refreshTokens_result.ok) {
		localStorage.setItem('id_token', data.AuthenticationResult.IdToken);
		localStorage.setItem('access_token', data.AuthenticationResult.AccessToken);
		let userData = parseJwt(data.AuthenticationResult.IdToken);
		user.set(userData);
	} else {
		localStorage.removeItem('refresh_token');
		user.set(false);
	}
}

function parseJwt(token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
	return JSON.parse(jsonPayload);
}

export async function getProfile() {
	let token_id = localStorage.getItem('id_token');
	let refresh_token = localStorage.getItem('refresh_token');
	if (token_id) {
		let data = parseJwt(token_id);
		if (data.exp * 1000 < Date.now()) {
			localStorage.removeItem('id_token');
			localStorage.removeItem('access_token');
			if (refresh_token) {
				return await refreshTokens();
			} else {
				user.set(false);
			}
		}
		user.set(data);
	} else {
		if (refresh_token) {
			return await refreshTokens();
		} else {
			user.set(false);
		}
	}
}

export function toLogin() {
	window.location.href = '/';
}

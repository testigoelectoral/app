import { writable } from 'svelte/store';
export const user = writable();

export const config = {
	accessTokenUrl: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`,
	authorizationUrl: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize`,
	profileUrl: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/userInfo`,
	clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
	scope: ['openid'].join(','),
	contentType: 'application/x-www-form-urlencoded'
};

export async function signOut() {
	localStorage.removeItem('id_token');
	localStorage.removeItem('access_token');
	return getProfile();
}

export function signIn() {
	location.assign(
		config.authorizationUrl +
			'?client_id=' +
			config.clientId +
			'&redirect_uri=' +
			window.location.origin +
			'&scope=' +
			config.scope +
			'&response_type=token&identity_provider=COGNITO&state=STATE'
	);
}

function parseHash(hash) {
	return JSON.parse(
		'{"' + hash.replace(/#/g, '').replace(/&/g, '","').replace(/=/g, '":"') + '"}',
		function (key, value) {
			return key === '' ? value : decodeURIComponent(value);
		}
	);
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
	let hash = window.location.hash;
	if (hash) {
		try {
			let tokens = parseHash(hash);
			localStorage.setItem('id_token', tokens.id_token);
			localStorage.setItem('access_token', tokens.access_token);
			window.history.replaceState({}, document.title, '/');
			user.set(parseJwt(tokens.id_token));
		} catch (error) {
			user.set(false);
		}
	} else {
		let token_id = localStorage.getItem('id_token');
		if (token_id) {
			let data = parseJwt(token_id);
			if (data.exp * 1000 < Date.now()) {
				localStorage.removeItem('id_token');
				localStorage.removeItem('access_token');
				user.set(false);
			}
			user.set(data);
		} else {
			user.set(false);
		}
	}
}

export function toLogin() {
	window.location.href = '/';
}

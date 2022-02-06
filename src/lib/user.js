import { writable } from 'svelte/store';
export const user = writable();

export async function signOut() {
	localStorage.removeItem('id_token');
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
	return await getProfile();
}

export async function signIn(usr,pwd) {
    const signIn_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": usr,"password": pwd
        })
    });
    let data = await signIn_result.json();

    if (signIn_result.ok){
        localStorage.setItem('id_token', data.AuthenticationResult.IdToken);
        localStorage.setItem('access_token', data.AuthenticationResult.AccessToken);
        localStorage.setItem('refresh_token', data.AuthenticationResult.RefreshToken);
        let userData = parseJwt(data.AuthenticationResult.IdToken);
        user.set(userData);
        return window.location.href = '/';
    }
    else{
        throw new Error(data.__type);
    }
}

export async function signUp(userInfo) {
    const signUp_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/user/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    });
    let data = await signUp_result.json();

    if (signUp_result.ok){
        localStorage.setItem('tmp_usr', userInfo.username);
        localStorage.setItem('tmp_pwd', userInfo.password);
        return window.location.href = '/confirm';
    }
    else{
        throw new Error(JSON.stringify(data));
    }
}

export async function confirm(code) {
    const confirm_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/user/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: localStorage.getItem('tmp_usr'),
            code: code
        })
    });
    let data = await confirm_result.json();

    if (confirm_result.ok){
        let usr = localStorage.getItem('tmp_usr');
        let pwd = localStorage.getItem('tmp_pwd')
        localStorage.removeItem('tmp_usr');
        localStorage.removeItem('tmp_pwd');
        return await signIn(usr,pwd);
    }
    else{
        throw new Error(JSON.stringify(data));
    }
}

export async function resendCode() {
    const resendCode_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/user/confirm`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: localStorage.getItem('tmp_usr')
        })
    });
    let data = await resendCode_result.json();

    if (resendCode_result.ok){
        console.log(JSON.stringify(data));
        return data.CodeDeliveryDetails.Destination;
    }
    else{
        throw new Error(JSON.stringify(data));
    }
}

async function refreshTokens() {
    const refreshTokens_result = await fetch(`${import.meta.env.VITE_API_DOMAIN}/user/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "refresh_token": localStorage.getItem('refresh_token')
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
            if (refresh_token){
                return await refreshTokens();
            } else {
                user.set(false);
            }
        }
        user.set(data);
    } else {
        if (refresh_token){
            return await refreshTokens();
        } else {
            user.set(false);
        }
    }
}

export function toLogin() {
	window.location.href = '/login';
}

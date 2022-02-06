<script>
	import { onMount } from 'svelte';
	import { user, getProfile, signUp } from '$lib/user';

	onMount(() => {
		getProfile().then(async function(){
			if($user){
				window.location.href = '/';
			}
		});
	});

	let userInfo = {
		username: "",
		password: "",
		email: "",
		name: "",
		phone: ""

	}

    let promise;
    function handleClick() {
        promise = signUp(userInfo);
	}

	// From https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html#API_SignUp_Errors
	let login_errors = {
		"CodeDeliveryFailureException": "Intento de envío del email de confirmación fallido.",
		"InvalidParameterException": "Parametro incorrecto.",
		"InvalidPasswordException": "Contraseña inválida, asegúrese de que contiene: Mayúsculas, Minúsculas, Números y al menos un caracter especial.",
		"TooManyRequestsException": "Muchos intentos de crecación de cuenta, servicio temporalmente bloqueado.",
		"UsernameExistsException": "Usuario/Datos ya existentes en el sistema"
	}
</script>

<svelte:head>
	<title>Crear Cuenta</title>
</svelte:head>

C.C. :<input bind:value={userInfo.username} />
Contraseña: <input type="password" bind:value={userInfo.password} />
Email :<input bind:value={userInfo.email} />
Nombre :<input bind:value={userInfo.name} />
Número de celular :<input bind:value={userInfo.phone} />
<button on:click={ handleClick }>Crear</button>
{#await promise}
	<p>...Creando</p>
{:catch error}
	<p style="color: red">{login_errors[JSON.parse(error.message).__type]}</p>
	<p style="color: blue">{JSON.parse(error.message).message}</p>
{/await}

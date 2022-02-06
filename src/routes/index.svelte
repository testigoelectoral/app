<script>
	import { onMount } from 'svelte';
	import { getProfile, signOut, user, signIn } from '$lib/user';

	onMount(() => {
		getProfile();
	});

    let promise;
    let disabled = false;
    let usr;
    let pwd;

    function handleClick() {
        promise = signIn(usr,pwd);
        disabled = true;
	}

	// From https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
	let login_errors = {
		"NotAuthorizedException": "C.C. o contraseña inválidos",
		"TooManyRequestsException": "Muchos intentos de ingreso, desabilitado temporalmente"
	}

</script>

<svelte:head>
	<title>Testigo Electoral</title>
</svelte:head>

<div class="d-flex flex-wrap justify-content-md-center">
	{#if $user}
		<a href="/upload" class="link-dark text-center m-2 py-3 bg-light rounded">
			<i class="bi-image" />
			<div class="mt-2">Subir Imagen</div>
		</a>
		<a href="/myimages" class="link-dark text-center m-2 py-3 bg-light rounded">
			<i class="bi-images" />
			<div class="mt-2">Mis Imágenes</div>
		</a>
		<a href="/account" class="link-dark text-center m-2 py-3 bg-light rounded">
			<i class="bi-person-bounding-box" />
			<div class="mt-2">Mi Cuenta</div>
		</a>
		<div class="a link-dark text-center m-2 py-3 bg-light rounded" on:click={signOut}>
			<i class="bi-box-arrow-right" />
			<div class="mt-2">Salir</div>
		</div>
	{:else}
		<div class="link-dark text-center m-2 py-3 bg-light rounded" on:click={signOut}>
			C.C. :<input bind:value={usr} />
			Contraseña: <input type="password" bind:value={pwd} />
			<button on:click={ handleClick } { disabled } >Ingresar</button>
			{#await promise}
				<p>...Ingresando</p>
			{:catch error}
				{#if error.message == "UserNotConfirmedException"}
				<p style="color: red">Usuario no confirmado, ingrese a <a href="/confirm">confirmar</a> para poder de ingresar.</p>
				{/if}
				<p style="color: red">{login_errors[error.message]}</p>
			{/await}
			</div>
		<a href="/signup" class="link-dark text-center m-2 py-3 bg-light rounded">
			<i class="bi-person-plus-fill" />
			<div class="mt-2">Crear Cuenta</div>
		</a>
	{/if}
</div>

<style lang="scss">
	a,
	.a {
		width: 170px;
		&:hover,
		&:focus {
			background-color: var(--bs-gray-300) !important;
		}
	}
	i {
		font-size: 3em;
	}
</style>

<script>
	import { onMount } from 'svelte';
	import { getProfile, signOut, user, signIn } from '$lib/account';

	onMount(() => {
		getProfile();
	});

	let promise;
	let email;
	let pwd;

	function handleClick() {
		promise = signIn(email, pwd);
		return false;
	}

	// From https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
	let login_errors = {
		NotAuthorizedException: 'email o contraseña inválidos',
		TooManyRequestsException: 'Muchos intentos de ingreso, desabilitado temporalmente'
	};
</script>

<svelte:head>
	<title>Testigo Electoral</title>
</svelte:head>
{#if $user}
	<div class="d-flex flex-wrap justify-content-md-center">
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
	</div>
{:else}
	<div class="row justify-content-md-center">
		<div class="col-md-6">
			<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
				<div class="card-body">
					<form on:submit|preventDefault={handleClick}>
						<div class="form-floating mb-3">
							<input
								type="email"
								class="form-control"
								id="email"
								bind:value={email}
								autocomplete="email"
							/>
							<label for="email">Email:</label>
						</div>
						<div class="form-floating mb-3">
							<input
								type="password"
								class="form-control"
								id="password"
								bind:value={pwd}
								autocomplete="password"
							/>
							<label for="password">Contraseña:</label>
						</div>
						<button type="submit" class="btn btn-primary mb-3">Ingresar</button>
					</form>
					<div>
						<a href="/signup" class="link-dark"> Crear Cuenta </a>
					</div>
					<div>
						<a href="/recovery" class="link-dark"> ¿Olvidó la contraseña? </a>
					</div>

					{#await promise}
						<p>...Ingresando</p>
					{:catch error}
						{#if error.message == 'UserNotConfirmedException'}
							<p style="color: red">
								Usuario no confirmado, ingrese a <a href="/confirm">confirmar</a> para poder ingresar.
							</p>
						{/if}
						<p style="color: red">{login_errors[error.message]}</p>
					{/await}
				</div>
			</div>
		</div>
	</div>
{/if}

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

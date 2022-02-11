<script>
	import { onMount } from 'svelte';
	import { user, getProfile, signUp } from '$lib/account';

	onMount(() => {
		getProfile().then(async function () {
			if ($user) {
				window.location.href = '/';
			}
		});
	});

	let userInfo = {
		email: '',
		password: '',
		document: '',
		name: '',
		phone: ''
	};

	let promise;
	function handleClick() {
		promise = signUp(userInfo);
	}

	// From https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html#API_SignUp_Errors
	let login_errors = {
		CodeDeliveryFailureException: 'Intento de envío del email de confirmación fallido.',
		InvalidParameterException: 'Parametro incorrecto.',
		InvalidPasswordException:
			'Contraseña inválida, asegúrese de que contiene: Mayúsculas, Minúsculas, Números y al menos un caracter especial.',
		TooManyRequestsException:
			'Muchos intentos de crecación de cuenta, servicio temporalmente bloqueado.',
		emailExistsException: 'Usuario/Datos ya existentes en el sistema'
	};
</script>

<svelte:head>
	<title>Crear Cuenta</title>
</svelte:head>
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
							bind:value={userInfo.email}
							autocomplete="email"
						/>
						<label for="email">Email:</label>
					</div>
					<div class="form-floating mb-3">
						<input
							type="password"
							class="form-control"
							id="password"
							bind:value={userInfo.password}
							autocomplete="new-password"
						/>
						<label for="password">Contraseña:</label>
					</div>
					<div class="form-floating mb-3">
						<input
							type="number"
							class="form-control"
							id="document"
							bind:value={userInfo.document}
						/>
						<label for="document">C.C.:</label>
					</div>
					<div class="form-floating mb-3">
						<input type="text" class="form-control" id="name" bind:value={userInfo.name} />
						<label for="name">Nombre:</label>
					</div>
					<div class="form-floating mb-3">
						<input
							type="text"
							class="form-control"
							id="phone"
							bind:value={userInfo.phone}
							placeholder="+573001122333"
						/>
						<label for="phone">Número de celular:</label>
					</div>
					<button type="submit" class="btn btn-primary">Crear</button>
				</form>
				<div>
					<a href="/" class="link-dark"> Ingresar</a>
				</div>
				<div>
					<a href="/recovery" class="link-dark"> ¿Olvidó la contraseña? </a>
				</div>

				{#await promise}
					<div class="alert alert-info mt-2">...Creando</div>
				{:then}
					<div class="alert alert-success mt-2">Finalizado</div>
				{:catch error}
					<div class="alert alert-danger mt-2">
						<div>
							{login_errors[JSON.parse(error.message).__type]}
						</div>
						<div>
							{JSON.parse(error.message).message}
						</div>
					</div>
				{/await}
			</div>
		</div>
	</div>
</div>

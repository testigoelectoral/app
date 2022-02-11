<script>
	import { onMount } from 'svelte';
	import { user, getProfile, confirmForgotPassword, resendCode } from '$lib/account';

	onMount(() => {
		if (!localStorage.getItem('tmp_email')) {
			window.location.href = '/';
		}
		getProfile().then(async function () {
			if ($user) {
				window.location.href = '/';
			}
		});
	});

	let code, password;

	let promiseConfirm;
	function handleConfirm() {
		promiseConfirm = confirmForgotPassword(code, password);
	}

	// From https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ConfirmSignUp.html#API_ConfirmSignUp_Errors
	let confirm_errors = {
		CodeMismatchException: 'Código inválido, intente de nuevo.',
		ExpiredCodeException: 'Código vencido, solicite uno nuevo.',
		TooManyFailedAttemptsException:
			'Muchos fallos de confirmación de cuenta, servicio temporalmente bloqueado.',
		TooManyRequestsException:
			'Muchos intentos de confirmación de cuenta, servicio temporalmente bloqueado.'
	};
</script>

<svelte:head>
	<title>Confirmar Cuenta</title>
</svelte:head>

<div class="row justify-content-md-center">
	<div class="col-md-6">
		<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
			<div class="card-body">
				<form on:submit|preventDefault={handleConfirm}>
					<div class="form-floating mb-3">
						<input type="text" class="form-control" id="code" bind:value={code} />
						<label for="code">Código enviado al correo:</label>
					</div>
					<div class="form-floating mb-3">
						<input
							type="password"
							class="form-control"
							id="password"
							bind:value={password}
							autocomplete="new-password"
						/>
						<label for="password">Nueva contraseña:</label>
					</div>
					<div class="d-grid gap-2">
						<button type="submit" class="btn btn-primary">Confirmar</button>
					</div>
				</form>

				{#await promiseConfirm}
					<div class="alert alert-info mt-2">...Creando</div>
				{:catch error}
					<div class="alert alert-danger mt-2">
						<div>
							{confirm_errors[JSON.parse(error.message).__type]}
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

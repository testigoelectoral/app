<script>
	import { onMount } from 'svelte';
	import { user, getProfile, confirm, resendCode } from '$lib/account';

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

	let code;

	let promiseConfirm;
	function handleConfirm() {
		promiseConfirm = confirm(code);
	}

	let promiseCode;
	function handleResendCode() {
		promiseCode = resendCode();
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

	// From https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ResendConfirmationCode.html#API_ResendConfirmationCode_Errors
	let resend_errors = {
		CodeDeliveryFailureException: 'No se pudo enviar el código, intente de nuevo.',
		UserNotFoundException: 'Usuario no encontrado, regrese a crear cuenta e intente de nuevo.',
		LimitExceededException: 'Muchos códigos enviados al mismo usuario, bloqueado temporalmente.'
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
					<div class="d-grid gap-2">
						<button type="submit" class="btn btn-primary">Confirmar</button>
						<button type="button" class="btn btn-warning" on:click={handleResendCode}
							>Reenviar código</button
						>
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

				{#await promiseCode}
					<div class="alert alert-info mt-2">...Enviando</div>
				{:catch error}
					<div class="alert alert-danger mt-2">
						<div>
							{resend_errors[JSON.parse(error.message).__type]}
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

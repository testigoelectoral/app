<script>
	import { onMount } from 'svelte';
	import { user, getProfile, forgotPassword } from '$lib/account';

	onMount(() => {
		getProfile().then(async function () {
			if ($user) {
				window.location.href = '/';
			}
		});
	});

	let email;

	let recovery;
	function handleConfirm() {
		recovery = forgotPassword(email);
	}

	// From https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ConfirmSignUp.html#API_ConfirmSignUp_Errors
	let confirm_errors = {
		InvalidEmailRoleAccessPolicyException: 'InvalidEmailRoleAccessPolicyException',
		InvalidLambdaResponseException: 'InvalidLambdaResponseException',
		InvalidParameterException: 'InvalidParameterException',
		InvalidSmsRoleAccessPolicyException: 'InvalidSmsRoleAccessPolicyException',
		LimitExceededException: 'LimitExceededException',
		NotAuthorizedException: 'NotAuthorizedException',
		ResourceNotFoundException: 'ResourceNotFoundException',
		TooManyRequestsException: 'TooManyRequestsException',
		UnexpectedLambdaException: 'UnexpectedLambdaException'
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
						<input type="email" class="form-control" id="email" bind:value={email} />
						<label for="email">Correo registrado:</label>
					</div>
					<div class="d-grid gap-2">
						<button type="submit" class="btn btn-primary">Enviar correo</button>
					</div>
				</form>

				{#await recovery}
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

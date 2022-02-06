<script>
	import { onMount } from 'svelte';
	import { user, getProfile, confirm, resendCode } from '$lib/user';

	onMount(() => {
        if (! localStorage.getItem('tmp_usr')){
            window.location.href = '/';
        }
		getProfile().then(async function(){
			if($user){
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
		"CodeMismatchException": "Código inválido, intente de nuevo.",
		"ExpiredCodeException": "Código vencido, solicite uno nuevo.",
		"TooManyFailedAttemptsException": "Muchos fallos de confirmación de cuenta, servicio temporalmente bloqueado.",
		"TooManyRequestsException": "Muchos intentos de confirmación de cuenta, servicio temporalmente bloqueado."
	}

	// From https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ResendConfirmationCode.html#API_ResendConfirmationCode_Errors
	let resend_errors = {
		"CodeDeliveryFailureException": "No se pudo enviar el código, intente de nuevo.",
		"UserNotFoundException": "Usuario no encontrado, regrese a crear cuenta e intente de nuevo.",
        "LimitExceededException": "Muchos códigos enviados al mismo usuario, bloqueado temporalmente."
	}

</script>

<svelte:head>
	<title>Confirmar Cuenta</title>
</svelte:head>

Code :<input bind:value={code} />
<button on:click={ handleConfirm }>Confirmar</button>
{#await promiseConfirm}
	<p>...Creando</p>
{:catch error}
	<p style="color: red">{confirm_errors[JSON.parse(error.message).__type]}</p>
	<p style="color: blue">{JSON.parse(error.message).message}</p>
{/await}


<button on:click={ handleResendCode }>Reenviar código</button>
{#if promiseCode != null}
    {#await promiseCode}
        <p>...Enviando</p>
    {:then message}
        <p style="color: blue">Código de confirmación enviado al email: {message}</p>
    {:catch error}
        <p style="color: red">{resend_errors[JSON.parse(error.message).__type]}</p>
        <p style="color: blue">{JSON.parse(error.message).message}</p>
    {/await}
{/if}
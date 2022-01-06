<script>
    import { signOut as authSignOut } from 'sk-auth/client';
	import { session } from '$app/stores';

    $: user = $session.user;

    function signIn() {
        location.assign('/api/auth/signin/cognito?redirect=/');
    }

    function signOut() {
        authSignOut().then(session.set);
    }
</script>

<svelte:head>
	<title>Testigo Electoral</title>
</svelte:head>

{#if !user}
    <button on:click="{signIn}">Ingresar/Registrarse</button>
{:else}
    <h2>Bienvenido {user.name}!</h2>
	<p>Apareces identificado con CC{user.username}</p>
    <p>Tu email ({user.email}) ha sido verificado: {user.email_verified}</p>
    <p>Tu telefono ({user.phone_number}) ha sido verificado: {user.phone_number_verified}</p>
    <p>Tu hash es: {user['custom:hash']}</p>
    <button on:click={signOut}>Salir</button>
{/if}

<script>
	import { signIn, getProfile, signOut } from '$lib/auth';

	let profile = getProfile()

	function clickLogout() {
		profile = signOut();
	}
	
</script>

{#await profile}
	<p>...waiting</p>
{:then user}	
	{#if !user.name}
		<button on:click={signIn}>Ingresar/Registrarse</button>
	{:else}
		<h2>Bienvenido {user.name}!</h2>
		<p>Apareces identificado con CC{user.username}</p>
		<p>Tu email ({user.email}) ha sido verificado: {user.email_verified}</p>
		<p>Tu telefono ({user.phone_number}) ha sido verificado: {user.phone_number_verified}</p>
		<p>Tu hash es: {user['custom:hash']}</p>
		<button on:click={clickLogout}>Salir</button>
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

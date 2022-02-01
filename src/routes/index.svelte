<script>
	import { onMount } from 'svelte';
	import { getProfile, signOut, user, signIn } from '$lib/auth';

	onMount(() => {
		getProfile();
	});
</script>

<svelte:head>
	<title>Testigo Electoral</title>
</svelte:head>

<div class="d-flex flex-wrap justify-content-md-center">
	<a href="/" class="link-dark text-center m-2 py-3 bg-light rounded">
		<i class="bi-house-fill" />
		<div class="mt-2">Inicio</div>
	</a>
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
		<div class="a link-dark text-center m-2 py-3 bg-light rounded" on:click={signIn}>
			<i class="bi-box-arrow-in-right" />
			<div class="mt-2">Iniciar Sesión/Registro</div>
		</div>
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

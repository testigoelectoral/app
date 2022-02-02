<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getProfile, user, toLogin } from '$lib/auth';
	import { loadJS } from '$lib/store';
	import Api from '$lib/api';
	onMount(async () => {
		await getProfile();
		if (!$user) toLogin();
		let api = new Api();

		api.myImages();
	});
</script>

<svelte:head>
	<title>Mis Imágenes</title>
</svelte:head>

{#if $user}
	<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
		<div class="card-body">
			<h5 class="card-title">Mis Imágenes</h5>
		</div>
	</div>
{/if}

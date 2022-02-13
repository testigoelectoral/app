<script>
	import { onMount } from 'svelte';
	import { getProfile, user, toLogin } from '$lib/account';
	import {Api} from '$lib/api'

	let promise = Promise.resolve([]);
	let api;

	onMount(async () => {
		await getProfile();
		if (!$user) toLogin();
		api = new Api();
		promise = api.myImages();
	});
</script>

<svelte:head>
	<title>Mis Imágenes</title>
</svelte:head>

{#if $user}
	<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
		<div class="card-body">
			<h5 class="card-title">Mis Imágenes</h5>
			<div class="d-flex flex-wrap justify-content-md-center">
				{#await promise}
					Cargando lista de imágenes ...
				{:then images}
					{#each images as image}
						<div class="mt-2 me-2">
							<img class="img-fluid" alt="img" src="{image.url}" />
						</div>
					{/each}
				{:catch error}
					<p style="color: red">{error.message}</p>
				{/await}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.img-fluid {
		max-width: 150px;
	}
</style>

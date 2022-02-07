<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getProfile, user, toLogin } from '$lib/user';
	import { loadJS } from '$lib/store';
	import Api from '$lib/api';

	let images = writable([]);
	let api;
	onMount(async () => {
		await getProfile();
		if (!$user) toLogin();
		api = new Api();

		let imagesV = await api.myImages();
		let promises = [];
		for (let i = 0; i < imagesV.length; i++) {
			const image = imagesV[i];
			promises.push(
				new Promise(async (resolve, reject) => {
					image.raw = await api.raw(image.ImageID);
					resolve();
				})
			);
		}
		Promise.all(promises).then((values) => {
			images.set(imagesV);
		});
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
				{#each $images as image}
					<div class="mt-2 me-2">
						<img class="img-fluid" alt="img" src={image.raw} />
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.img-fluid {
		max-width: 150px;
	}
</style>

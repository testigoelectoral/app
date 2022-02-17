<script>
	import { onMount } from 'svelte';
	import { getProfile, user, toLogin } from '$lib/account';
	import Api from '$lib/api';

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
						<div class="mt-2 me-2 px-2 py-2 border-4 rounded border border-success pr">
							<img class="img-fluid" alt="img" src={image.url} />
							<div class="d-grid mt-2 pa b0">
								{#if !image.OwnerReport}
									<a class="btn btn-success" href="/image/{image.ImageID}">
										<i class="bi bi-archive" />
										Votar
									</a>
								{:else}
									<div class="mt-2">Revisar</div>
								{/if}
							</div>
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
	.pr {
		position: relative;
	}
	.pa {
		position: absolute;
	}
	.b0 {
		bottom: 8px;
		width: calc(100% - 16px);
	}
	.img-fluid {
		max-width: 138px;
		margin-bottom: 46px;
	}
</style>

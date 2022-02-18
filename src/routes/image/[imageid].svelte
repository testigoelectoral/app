<script>
	import { getProfile, user, toLogin } from '$lib/account';
	import { page } from '$app/stores';
	import Api from '$lib/api';
	import { onMount } from 'svelte';
	import TableReport from './report.svelte';
	import FormSenado from './form_senado.svelte'
	import FormCamara from './form_camara.svelte'
	import FormConsulta from './form_consulta.svelte'

	let image;
	let api;
	let newReport = {};
	onMount(async () => {
		await getProfile();
		if (!$user) toLogin();
		api = new Api();
		image = await api.image($page.params.imageid);
	});
</script>

<div class="mt-2">
	<a href="/myimages" class="btn btn-secondary">
		<i class="bi bi-arrow-left" />
		Volver</a
	>
</div>
<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
	<div class="card-body">
		<h5 class="card-title">Agregar los votos para la imágen</h5>
		{#if !image}
			Cargando Datos ...
		{:else}
			<div class="text-center">
				<img class="img-fluid" alt="img" src={image.url} />
			</div>
			{#if !image.info.OwnerReport}
				{#if image.info.TypeCode == 71}
					<FormCamara bind:votes={image.votes} StateCode={image.info.StateCode} />
				{:else if image.info.TypeCode == 72}
					<FormSenado bind:votes={image.votes} />
				{:else}
					<FormSenado bind:votes={image.votes} />
				{/if}
				<TableReport bind:votes={image.votes} editable={true} />
			{:else}
				<TableReport votes={image.votes} />
			{/if}
		{/if}
	</div>
</div>

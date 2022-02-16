<script>
	import { getProfile, user, toLogin } from '$lib/account';
	import { page } from '$app/stores';
    import Api from '$lib/api'
    import { onMount } from 'svelte';
	import TableReport from './report.svelte'
	import FormReport from './form.svelte'

    let promiseImage = Promise.resolve({info:{OwnerReport:false}});
	let api;
	let newReport = {};
    onMount(async () => {
		await getProfile();
		if (!$user) toLogin();
		api = new Api();
		promiseImage = api.image($page.params.imageid);
	});


</script>
{#await promiseImage}
Cargando Datos ...
{:then image}
<div class="row justify-content-md-center">
	<div class="col-md-6">
		<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
			<div class="card-body">
				{#if ! image.info.OwnerReport}
					<TableReport bind:votes={newReport} editable={true} />
					<FormReport bind:votes={newReport} TypeCode={image.info.TypeCode} StateCode={image.info.StateCode}/>
				{:else}
					<TableReport votes={image.votes} />
				{/if}
				<div class="form-floating mb-3">
					<img class="img-fluid" alt="img" src="{image.url}" />
				</div>
			</div>
		</div>
	</div>
</div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

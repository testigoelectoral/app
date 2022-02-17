<script>
	import { page } from '$app/stores';
	import Api from '$lib/api';

	export let votes = {};

	export let editable = false;
	export let confirm = false;

	function remove(key) {
		delete votes[key];
		votes = votes;
	}

	function partidoFromKey(key) {
		return key.split('|')[0];
	}
	function candidatoFromKey(key) {
		return key.split('|')[1];
	}

	let api = new Api();

	let promiseReport = Promise.resolve({});
	async function handleReport() {
		promiseReport = await api.report($page.params.imageid, votes);
		window.location.href = '/myimages';
	}
</script>

<div class="mt-2 px-2 py-2 border-4 rounded border border-info">
	{#if Object.entries(votes).length > 0}
		<table class="table">
			<thead>
				<tr>
					<th scope="col">Partido</th>
					<th scope="col">Candidato</th>
					<th scope="col">Votos</th>
					{#if editable}
						<th scope="col" />
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(votes) as [key, value]}
					<tr>
						<th scope="row">{partidoFromKey(key)}</th>
						<td>{candidatoFromKey(key)}</td>
						<td class="text-end">{value}</td>
						{#if editable}
							<td
								><div class="btn btn-danger btn-sm" on:click={remove(key)}>
									<i class="bi bi-trash" />
								</div></td
							>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<div class="alert alert-warning mb-0" role="alert">
			<div class="text-center">
				<i class="bi bi-archive" style="font-size: 4rem" />
			</div>
			<div class="text-center">No se han agregado votos</div>
		</div>
	{/if}
</div>

{#if editable}
	<div class="mt-2 px-2 py-2 border-4 rounded border border-info">
		<form on:submit|preventDefault={handleReport} class="row g-2">
			<div class="col-md-6">
				<div class="form-check col-md-6">
					<input class="form-check-input" type="checkbox" id="confirm" bind:checked={confirm} />
					<label class="form-check-label" for="confirm"> Confirma estos datos? </label>
				</div>
			</div>
			<div class="col-md-6">
				<div class="d-grid gap-2">
					<button type="submit" class="btn btn-primary" disabled={!confirm}>Enviar reporte</button>
				</div>
			</div>
		</form>
		{#await promiseReport}
			<div class="alert alert-info mt-2">... Enviando ...</div>
		{:catch error}
			<div class="alert alert-danger mt-2">
				<div>
					{JSON.parse(error.message)}
				</div>
			</div>
		{/await}
	</div>
{/if}

<style lang="scss">
	table {
		font-size: 80%;
	}
</style>

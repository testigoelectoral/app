<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getProfile, user, toLogin } from '$lib/account';
	import QrScanner from 'qr-scanner';
	import { puestoFromQR } from '$lib/data';
	import Api from '$lib/api';
	import GeoLocation from '$lib/GeoLocation.svelte';

	let location;
	let api;

	onMount(async () => {
		await getProfile();
		if (!$user) toLogin();
		api = new Api();
	});

	const preview = writable([]);
	let files = [];
	let filesQr = {};
	let imageData = {};

	const scanQr = (imageRaw, i) => {
		QrScanner.scanImage(imageRaw, { returnDetailedScanResult: true })
			.then((result) => {
				filesQr[i] = result.data;
				imageData[i] = puestoFromQR(result.data);
			})
			.catch((e) => {
				console.log(e);
				filesQr[i] = '';
			});
	};

	const onFileSelected = (e) => {
		let previewT = [];
		files = e.target.files;
		for (let i = 0; i < e.target.files.length; i++) {
			const imageRaw = e.target.files[i];
			scanQr(imageRaw, i);

			let reader = new FileReader();
			reader.onload = (e) => {
				previewT[i] = e.target.result;
			};
			reader.readAsDataURL(imageRaw);
		}
		preview.set(previewT);
		console.log(files.length);
	};
	function uploads() {
		let promises = [];
		for (let i = 0; i < files.length; i++) {
			const imageRaw = files[i];
			promises.push(api.upload(location, filesQr[i], `${$user['custom:hash']}`, imageRaw));
		}
		Promise.all(promises).then((_r) => {
			window.location.href = '/myimages';
		});
	}
</script>

<svelte:head>
	<title>Subir Imágenes</title>
</svelte:head>

<GeoLocation bind:coords={location} />

{#if $user}
	<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
		<div class="card-body">
			<h5 class="card-title">Subir Imágenes</h5>
			<input
				multiple="true"
				class="form-control mt-2"
				type="file"
				accept=".jpg, .jpeg, .png, .webp"
				on:change={(e) => onFileSelected(e)}
			/>
			<div class="d-flex flex-wrap justify-content-md-center">
				{#each $preview as src, i}
					<div
						class="mt-2 me-2 px-2 py-2 border-4 rounded {filesQr[i]
							? 'border border-success'
							: 'border border-danger'}"
					>
						<img class="img-fluid" {src} alt="d" id="img-{i}" />
						<div class="d-grid mt-2">
							{#if !filesQr[i]}
								<div class="btn btn-danger">
									<i class="bi bi-qr-code" />
									Error de QR
								</div>
							{:else}
								<div class="btn btn-info">
									Departamento: ({imageData[i].StateCode}) {imageData[i].StateName}<br />
									Municipio/Zona: ({imageData[i].MunicipalityCode}) {imageData[i].MunicipalityName} /
									{imageData[i].ZoneCode}<br />
									Puesto: ({imageData[i].PlaceCode}) {imageData[i].PlaceName}<br />
									Tipo/Mesa/Pagina: {#if imageData[i].PageType == '71'}Senado{:else}Camara{/if} / {imageData[
										i
									].Table} / {imageData[i].PageNumber}<br />
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
			<div class="text-center">
				<button class="btn btn-primary mt-2" disabled={!files.length} on:click={uploads}>
					<i class="bi bi-cloud-upload" />
					Subir Imágenes
				</button>
			</div>
			<div class="alert alert-info mt-2" role="alert">
				Suba imágenes tomadas en la jornada electoral
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.d-flex img {
		max-width: 138px;
	}
</style>

<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getProfile, user, toLogin } from '$lib/account';
	import { loadJS } from '$lib/store';
	import QrScanner from 'qr-scanner';
	import { puestoFromQR } from '$lib/data'
	import Api from '$lib/api'

	let errorMsg, location;
	let api;


	onMount(async () => {
		await getProfile();
		if (!$user) toLogin();

		api = new Api();
		let geoModal, id;
		let options = {
			enableHighAccuracy: false,
			timeout: 5000,
			maximumAge: 0
		};
		function error(err) {
			errorMsg = err.message;
			geoModal.show();
		}

		function success(pos) {
			location = pos.coords;
		}
		function checkGPS() {
			id = navigator.geolocation.watchPosition(success, error, options);
		}

		loadJS('/js/bootstrap.min.js', () => {
			let xid = document.getElementById('geoModal');
			geoModal = new bootstrap.Modal(xid);
			xid.addEventListener('hidden.bs.modal', function (event) {
				checkGPS();
			});
			checkGPS();
		});
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
			promises.push(api.upload(location,filesQr[i],`${$user['custom:hash']}`,imageRaw));
		}
		Promise.all(promises).then((_r) => {
			window.location.href = '/myimages';
		});
	}
</script>

<svelte:head>
	<title>Subir Imágenes</title>
</svelte:head>

<div
	class="modal fade"
	id="geoModal"
	tabindex="-1"
	aria-labelledby="geoModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="geoModalLabel">Necesito permisos</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="alert alert-danger mt-2" role="alert">
					{errorMsg}
				</div>

				<div class="alert alert-warning mt-2" role="alert">
					<i class="bi bi-exclamation-triangle" />
					Debe permitir el uso de GPS para este paso
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>

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
								Departamento: ({imageData[i].StateCode}) {imageData[i].StateName}<br/>
								Municipio/Zona: ({imageData[i].MunicipalityCode}) {imageData[i].MunicipalityName} / {imageData[i].ZoneCode}<br/>
								Puesto: ({imageData[i].PlaceCode}) {imageData[i].PlaceName}<br/>
								Tipo/Mesa/Pagina: {#if imageData[i].PageType == "71"}Senado{:else}Camara{/if} / {imageData[i].Table} / {imageData[i].PageNumber}<br/>
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
		max-width: 150px;
	}
</style>

<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getProfile, user, toLogin } from '$lib/user';
	import { loadJS } from '$lib/store';
	import QrScanner from 'qr-scanner';

	let errorMsg, location;

	onMount(async () => {
		await getProfile();
		if (!$user) toLogin();

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
	let imageRaw, imageContentType, fileinput;

	const scanQr = (imageRaw, i) => {
		QrScanner.scanImage(imageRaw, { returnDetailedScanResult: true })
			.then((result) => {
				filesQr[i] = result.data;
				console.log(result.data);
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
		for (let i = 0; i < files.length; i++) {
			const imageRaw = files[i];
			upload(imageRaw);
		}
	}

	async function upload(imageRaw) {
		try {
			let qrcode = await QrScanner.scanImage(imageRaw, { returnDetailedScanResult: true });
			const response = await fetch('https://api-dev.testigoelectoral.org/myimages', {
				method: 'PUT',
				headers: {
					'X-Amz-Meta-Accuracy': location.accuracy,
					'X-Amz-Meta-Latitude': location.latitude,
					'X-Amz-Meta-Longitude': location.longitude,
					'X-Amz-Meta-User-Hash': `${$user['custom:hash']}`,
					'X-Amz-Meta-Qr-Code': qrcode.data,
					'Content-Type': imageRaw.type,
					Authorization: `${localStorage.getItem('id_token')}`
				},
				body: imageRaw
			});
			if (response.ok) {
				console.log('Imagen uploaded successfully');
			} else {
				console.log("File wasn't uploaded, try again");
			}
		} catch (error) {
			console.log('Error:', error);
		}
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
				bind:this={fileinput}
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

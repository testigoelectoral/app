<script>
	import { onMount } from 'svelte';
	import { getProfile, user, signIn } from '$lib/auth';

	onMount(() => {
		getProfile();
	});

	let preview, imageRaw,imageContentType, fileinput

	const onFileSelected =(e)=>{
		imageRaw = e.target.files[0];
		let reader = new FileReader();

		reader.onload = e => {
			preview = e.target.result
		};
		
		reader.readAsDataURL(imageRaw);
	}

	function upload() {
        const upload = fetch('https://api-dev.testigoelectoral.org/myimages', {
            method: 'PUT',
			headers: {
				"X-Amz-Meta-Accuracy": "15.391",
				"X-Amz-Meta-Latitude": "4.595696",
				"X-Amz-Meta-Longitude": "-74.078918",
				"X-Amz-Meta-User-Hash": `${$user["custom:hash"]}`,
				"X-Amz-Meta-Qr-Code": "711600102070110113201",
				"Content-Type": imageRaw.type,
				"Authorization": `${localStorage.getItem('id_token')}`,
			},
            body: imageRaw
        }).then(function(response) {
			if(response.ok) {
				console.log('Imagen uploaded successfully');
				fileinput.value = '';
				imageRaw = undefined;
				preview = '';
			} else {
				console.log("File wasn't uploaded, try again");
				fileinput.value = '';
				imageRaw = undefined;
				preview = '';
			}
		}).catch((error) => {
			console.error('Error:', error);
			fileinput.value = '';
			imageRaw = undefined;
			preview = '';
		});
    }
</script>

<svelte:head>
	<title>Subir Imágenes</title>
</svelte:head>
{#if $user}
<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
	<div class="card-body">
    <h5 class="card-title">Subir Imágenes</h5>
		{#if preview}
		<img class="col-auto img-fluid" src="{preview}" alt="d" />
		<div class="link-dark text-center m-2 py-3 bg-light rounded">
			<i class="bi-cloud-upload" on:click={upload} />
		</div>
		{/if}
		<div class="link-dark text-center m-2 py-3 bg-light rounded">
			<i class="bi-camera" on:click={()=>{fileinput.click();}} />
			<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
		</div>
		<div class="alert alert-info mt-2" role="alert">
			Suba imágenes tomadas en la jornada electoral
		</div>
	</div>
</div>
{:else}
<div class="a link-dark text-center m-2 py-3 bg-light rounded" on:click={signIn}>
	<div class="mt-2">Iniciar Sesión/Registro</div>
</div>
{/if}

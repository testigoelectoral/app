<svelte:head>
	<title>Subir Imágenes</title>
</svelte:head>
<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
	<div class="card-body">
    <h5 class="card-title">Subir Imágenes</h5>
		<form class="mt-2">
			<div class="col-auto">
				<label for="formFileMultiple" class="form-label">Seleccione las imágenes</label>
				<input class="form-control" type="file" id="formFileMultiple" multiple />
			</div>
		</form>

		<div class="alert alert-info mt-2" role="alert">
			Suba imágenes tomadas en la jornada electoral
		</div>
	</div>
</div>

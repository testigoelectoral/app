<script>
    import { onMount } from 'svelte';
	import { loadJS } from '$lib/store';

    export let coords = undefined;
    let errorMsg,geoModal;

    async function getCoordinates() {
        const position = await new Promise(function(resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        coords = position.coords;
        return coords;
    }

    function positionError(err) {
        errorMsg = err.message;
        geoModal.show();
    }

	onMount(async () => {
		loadJS('/js/bootstrap.min.js', () => {
			let xid = document.getElementById('geoModal');
			geoModal = new bootstrap.Modal(xid);
			xid.addEventListener('hidden.bs.modal', function (event) {
				getCoordinates().catch(positionError);
			});
			getCoordinates().catch(positionError);
		});
	});
</script>

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

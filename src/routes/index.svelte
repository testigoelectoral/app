<script>
	import { signIn, getProfile, signOut } from '$lib/auth';

	let profile = getProfile();

	function clickLogout() {
		profile = signOut();
	}
</script>

<div class="row justify-content-md-center">
	<div class="col-md-6">
		{#await profile}
			<div class="d-flex justify-content-center">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Cargando...</span>
				</div>
			</div>
		{:then user}
			{#if !user.name}
				<div class="card card-cover h-100 overflow-hidden rounded-5 shadow-lg">
					<div class="card-body">
						<h5 class="card-title">Iniciar Sesión</h5>
						<p class="card-text">Tengo unas palabras para decir pero no me animo.</p>
						<div class="d-grid gap-2">
							<button href="#" class="btn btn-primary" on:click={signIn}>
								Ingresar/Registrarse
							</button>
						</div>
					</div>
				</div>
			{:else}
				<div class="card card-cover h-100 overflow-hidden rounded-5 shadow-lg">
					<div class="card-body">
						<h5 class="card-title">Bienvenido {user.name}!</h5>

						<ul class="list-group">
							<li class="list-group-item d-flex justify-content-between align-items-start">
								<div class="ms-2 me-auto text-truncate">
									<div class="fw-bold">Apareces identificado con</div>
									CC {user['cognito:username']}
								</div>
							</li>
							<li class="list-group-item d-flex justify-content-between align-items-start">
								<div class="ms-2 me-auto text-truncate">
									<div class="fw-bold">Tu email</div>
									{user.email}
								</div>
								{#if user.email_verified}
									<span class="badge bg-success rounded-pill">OK</span>
								{:else}
									<span class="badge bg-danger rounded-pill">NO</span>
								{/if}
							</li>
							<li class="list-group-item d-flex justify-content-between align-items-start">
								<div class="ms-2 me-auto text-truncate">
									<div class="fw-bold">Tu telefono</div>
									{user.phone_number}
								</div>
								{#if user.phone_number_verified}
									<span class="badge bg-success rounded-pill">OK</span>
								{:else}
									<span class="badge bg-danger rounded-pill">NO</span>
								{/if}
							</li>
							<li class="list-group-item d-flex justify-content-between align-items-start">
								<div class="ms-2 me-auto text-truncate">
									<div class="fw-bold">Tu hash es</div>
									{user['custom:hash']}
								</div>
							</li>
						</ul>

						<div class="d-grid gap-2 mt-3">
							<button href="#" class="btn btn-primary" on:click={clickLogout}> Salir </button>
						</div>
					</div>
				</div>
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</div>

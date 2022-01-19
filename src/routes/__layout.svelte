<script>
	import { onMount } from 'svelte';
	import { loadJS } from '$lib/store';
	onMount(async () => {
		loadJS('/js/bootstrap.min.js', () => {})
	})
</script>

<svelte:head>
	<title>Testigo Electoral</title>
</svelte:head>

<header class="py-3 mt-2 mb-2 ms-2 me-2">
	<nav class="navbar navbar-expand-lg navbar-light bg-light shadow-lg rounded">
		<div class="container-fluid">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarMenu">
				<a class="navbar-brand" href="#">TE</a>
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a class="nav-link active" aria-current="page" href="/">Inicio</a>
					</li>
					<li class="nav-item">
						<a class="nav-link active" aria-current="page" href="/">Subir foto</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>

<div class="row bg-white text-dark shadow-lg bg-body rounded mt-2 mb-5 ms-2 me-2">
	<div class="col pt-3 pb-3">
		<h1 class="text-center mb-3">Testigo Electoral</h1>
		<slot />
	</div>
</div>

<script>
	import { onMount } from 'svelte';
	import { getProfile } from '$lib/auth';

	onMount(() => {
		getProfile();
	});
</script>

<header class="p-3 bg-dark text-white">
	<div class="container">
		<div
			class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start"
		>
			<ul class="nav col-12 col-md-auto me-md-auto mb-2 justify-content-center mb-md-0">
				<li><a href="/" class="nav-link px-2 text-secondary">Testigo Electoral</a></li>
			</ul>
		</div>
	</div>
</header>

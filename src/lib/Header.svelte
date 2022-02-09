<script>
	import { onMount } from 'svelte';
	import { user, getProfile, signIn } from '$lib/account';

	onMount(() => {
		getProfile();
	});
</script>

<header class="p-3 bg-dark text-white">
	<div class="container">
		<div
			class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start"
		>
			<ul class="nav col-6 col-md-auto me-auto mb-2 justify-content-center mb-md-0">
				<li><a href="/" class="nav-link px-2 text-secondary">Testigo Electoral</a></li>
			</ul>
			<ul class="nav col-6 col-md-auto mb-2 justify-content-right mb-md-0">
				{#if $user}
					<li><a href="/account" class="nav-link px-2 text-secondary">{$user.name}</a></li>
				{:else}
					<li><a href="/" class="nav-link px-2 text-secondary" on:click={signIn}>Ingresar</a></li>
				{/if}
			</ul>
		</div>
	</div>
</header>

<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { onMount } from 'svelte';
	import { loadJS } from '$lib/store';
	onMount(async () => {
		loadJS('/js/bootstrap.min.js', () => {})
	})
</script>

<Header />
<main class="container">
	<slot />
</main>

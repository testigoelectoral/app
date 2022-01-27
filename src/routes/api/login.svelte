<script>
	import { onMount } from 'svelte';

	import { session } from '$app/stores';
	import { config } from '$lib/auth';

	$: user = $session.user;

	function ucFirst(val) {
		return val.charAt(0).toUpperCase() + val.slice(1);
	}

	async function getUserProfile(tokens) {
		const res = await fetch(config.profileUrl, {
			headers: { Authorization: `${ucFirst(tokens.token_type)} ${tokens.access_token}` }
		});
		return await res.json();
	}

	onMount(async () => {
		let hash = window.location.hash;
		if (hash) {
			try {
				let tokens = JSON.parse(
					'{"' + hash.replace(/#/g, '').replace(/&/g, '","').replace(/=/g, '":"') + '"}',
					function (key, value) {
						return key === '' ? value : decodeURIComponent(value);
					}
				);
				user = await getUserProfile(tokens);
        localStorage.setItem('user', user);
			} catch (error) {
				user = {};
			}
		}
	});
</script>
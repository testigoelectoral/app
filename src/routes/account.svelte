<script>
	import { onMount } from 'svelte';
	import { user, getProfile, signOut } from '$lib/account';

	onMount(() => {
		getProfile();
	});
</script>

<svelte:head>
	<title>Mi Cuenta</title>
</svelte:head>

{#if $user}
	<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
		<div class="card-body">
			<h5 class="card-title">Bienvenido {$user.name}!</h5>

			<ul class="list-group">
				<li class="list-group-item d-flex justify-content-between align-items-start">
					<div class="ms-2 me-auto text-truncate">
						<div class="fw-bold">Apareces identificado con</div>
						C.C. {$user['custom:document']}
					</div>
				</li>
				<li class="list-group-item d-flex justify-content-between align-items-start">
					<div class="ms-2 me-auto text-truncate">
						<div class="fw-bold">Tu email</div>
						{$user.email}
					</div>
					{#if $user.email_verified}
						<span class="badge bg-success rounded-pill">OK</span>
					{:else}
						<span class="badge bg-danger rounded-pill">NO</span>
					{/if}
				</li>
				<li class="list-group-item d-flex justify-content-between align-items-start">
					<div class="ms-2 me-auto text-truncate">
						<div class="fw-bold">Tu telefono</div>
						{$user.phone_number}
					</div>
					{#if user.phone_number_verified}
						<span class="badge bg-success rounded-pill">OK</span>
					{:else}
						<span class="badge bg-danger rounded-pill">NO</span>
					{/if}
				</li>
			</ul>
		</div>
	</div>
	<div class="card card-cover overflow-hidden rounded-5 shadow-lg mt-2">
		<div class="d-flex flex-wrap justify-content-md-center">
			<div class="a link-dark text-center m-2 py-3 bg-light rounded" on:click={signOut}>
				<i class="bi-box-arrow-right" />
				<div class="mt-2">Salir</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	a,
	.a {
		width: 170px;
		&:hover,
		&:focus {
			background-color: var(--bs-gray-300) !important;
		}
	}
	i {
		font-size: 3em;
	}
</style>

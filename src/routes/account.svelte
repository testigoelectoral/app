<script>
	import { onMount } from 'svelte';
	import { user, getProfile } from '$lib/auth';

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
						CC {$user["cognito:username"]}
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
{/if}

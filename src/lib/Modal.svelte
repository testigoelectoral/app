<script>
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let style = '';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal;

	const handle_keydown = (e) => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="modalSvelteBackground" on:click={close} />
<div class="modalSvelte" role="dialog" aria-modal="true" {style} bind:this={modal}>
	<div class="modal-content">
		<div class="modal-header">
			<div class="b w-100"><slot name="header" /></div>
			<button class="btn-flat pw-0-5 ph-0-5" type="button" data-dismiss="modal" aria-label="Cerrar" on:click={close}><i aria-hidden="true" class="ff ff-times" /> </button>
		</div>
		<div class="modal-body">
			<slot />
		</div>
		<div class="modal-footer tr">
			<slot name="footer">
				<!-- svelte-ignore a11y-autofocus -->
				<button autofocus on:click={close} class="btn btn--primary minw-190p">Cerrar</button>
			</slot>
		</div>
	</div>
</div>

<style>
	.modalSvelteBackground {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
		z-index: 10000;
	}

	.modalSvelte {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100vw;
		max-width: 32em;
		max-height: 100vh;
		overflow: hidden;
		transform: translate(-50%, -50%);
		z-index: 10001;
	}
</style>

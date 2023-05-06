<script lang="ts">
	import cn from '$lib/utils/cn'
	import BaseTeleport from './BaseTeleport.svelte'

	type Activator =
		| false
		| {
				class?: string
				text?: string
		  }

	export let value: boolean = false
	export let title = 'Base Modal'
	export let activator: Activator = {
		class: 'btn',
		text: 'Open Modal'
	}

	export let modalBox = ''

	const onShow = () => {
		value = true
	}

	const onHide = () => {
		value = false
	}
</script>

{#if activator !== false}
	<slot name="activator" onClick={onShow}>
		<button class={activator.class || 'btn'} on:click={onShow}>{activator.text || 'Open'}</button>
	</slot>
{/if}

<BaseTeleport to="body">
	<div class="base-modal">
		<input bind:checked={value} type="checkbox" class="modal-toggle" />
		<div class="modal overflow-auto">
			<div class={cn('relative overflow-visible modal-box', modalBox)}>
				<button class="absolute btn btn-sm btn-circle right-2 top-2" on:click={onHide}> ✕ </button>
				<h3 class="text-lg font-bold">{title}</h3>
				<div class="mt-4">
					<slot />
				</div>
			</div>
		</div>
	</div>
</BaseTeleport>

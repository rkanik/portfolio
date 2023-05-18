<script lang="ts">
	import cn from '$lib/utils/cn'
	import { onDestroy } from 'svelte'
	import BaseTeleport from './BaseTeleport.svelte'

	type Activator =
		| false
		| {
				class?: string
				text?: string
		  }

	export let value: boolean = false
	export let title: string | undefined = undefined
	export let activator: Activator = {
		class: 'btn',
		text: 'Open Modal'
	}
	export let hideClose = false

	export let modalBox = ''

	const onShow = () => {
		value = true
	}

	const onHide = () => {
		value = false
	}

	const setBodyOverflow = (overflow: CSSStyleDeclaration['overflow']) => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = overflow
		}
	}

	$: {
		setBodyOverflow(value ? 'hidden' : 'auto')
	}

	onDestroy(() => {
		setBodyOverflow('auto')
	})
</script>

{#if activator !== false}
	<slot name="activator" onClick={onShow}>
		<button class={activator.class || 'btn'} on:click={onShow}>{activator.text || 'Open'}</button>
	</slot>
{/if}

<BaseTeleport to="body">
	<div class="base-modal">
		<input bind:checked={value} type="checkbox" class="modal-toggle" />
		<div class="modal overflow-auto block py-12">
			<div class={cn('relative modal-box max-h-max mx-auto', modalBox)}>
				{#if !hideClose}
					<button class="absolute btn btn-sm btn-circle right-2 top-2" on:click={onHide}>
						✕
					</button>
				{/if}
				{#if title}
					<h3 class="text-lg font-bold">{title}</h3>
				{/if}
				<div class={cn({ 'mt-4': title || !hideClose })}>
					<slot close={onHide} />
				</div>
			</div>
		</div>
	</div>
</BaseTeleport>

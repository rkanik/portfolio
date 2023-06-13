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

	export let eager = true
	export let value: boolean
	export let title: string | undefined = undefined
	export let activator: Activator = {
		class: 'btn',
		text: 'Open Modal'
	}
	export let hideClose = false

	export let modalBox = ''
	export let modalClass = 'overflow-auto'

	const onShow = () => {
		value = true
	}

	const onClose = () => {
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

	let isInitialized = false
	$: if (value && !isInitialized) {
		isInitialized = true
	}

	onDestroy(() => {
		setBodyOverflow('auto')
	})
</script>

{#if activator !== false}
	<slot name="activator" onClick={onShow}>
		<button type="button" class={activator.class || 'btn'} on:click={onShow}>
			{activator.text || 'Open'}
		</button>
	</slot>
{/if}

<BaseTeleport to="body">
	<div class="base-modal">
		<input bind:checked={value} readonly type="checkbox" class="modal-toggle" />
		<div class={cn('modal block py-12', modalClass)}>
			<div class={cn('relative modal-box max-h-max mx-auto', modalBox)}>
				{#if !hideClose}
					<button
						type="button"
						class="absolute btn btn-sm btn-circle right-2 top-2"
						on:click={onClose}
					>
						✕
					</button>
				{/if}
				{#if title}
					<h3 class="text-lg font-bold">{title}</h3>
				{/if}
				<div class={cn({ 'mt-4': title || !hideClose })}>
					{#if eager || (!eager && isInitialized)}
						<slot {onClose} close={onClose} />
					{/if}
				</div>
			</div>
		</div>
	</div>
</BaseTeleport>

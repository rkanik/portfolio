<script lang="ts">
	import { cn } from '@utils/index'
	import Div from '$lib/components/Div.svelte'
	import * as Dialog from '@ui/dialog'

	export let title = ''
	export let description = ''
	export let wrapper: any = Div
	export let wrapperProps: any | undefined = {}

	export let open = false
	export let onOpenChange = (v: boolean) => {
		open = v
	}
</script>

<Dialog.Root {open} {onOpenChange}>
	{#if $$slots.trigger}
		<Dialog.Trigger asChild let:builder>
			<slot name="trigger" {builder} />
		</Dialog.Trigger>
	{/if}
	<Dialog.Content
		class={cn(
			'flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden p-0',
			$$restProps.class || 'w-[calc(100%-2rem)] sm:max-w-[425px]',
		)}
	>
		<svelte:component
			this={wrapper}
			{...wrapperProps}
			class={cn('flex flex-col overflow-hidden', wrapperProps.class)}
		>
			<Dialog.Header class="space-y-1 border-b px-4 py-3">
				{#if title}
					<Dialog.Title>{title}</Dialog.Title>
				{/if}
				{#if description}
					<Dialog.Description>{description}</Dialog.Description>
				{/if}
			</Dialog.Header>
			<div class="flex-1 overflow-auto p-4">
				<slot />
			</div>
			<Dialog.Footer class="!justify-start border-t px-4 py-3">
				<slot name="footer" />
			</Dialog.Footer>
		</svelte:component>
	</Dialog.Content>
</Dialog.Root>

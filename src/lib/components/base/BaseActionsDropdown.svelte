<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import BaseDropdown from './BaseDropdown.svelte'
	import Icon from '@iconify/svelte'

	type Action =
		| { divider: true }
		| {
				text: string
				icon: string
				href?: string
				event?: string
		  }

	export let item: any
	export let actions: Action[] = [
		{
			text: 'Delete',
			event: 'delete',
			icon: 'ic:outline-delete'
		}
	]

	const dispatch = createEventDispatcher()
	const onClick = (action: Action) => {
		return () => {
			if ('event' in action && action.event) {
				dispatch(action.event, item)
			}
		}
	}
</script>

<BaseDropdown {...$$props}>
	<button slot="activator" class="btn btn-sm btn-circle">
		<Icon icon="material-symbols:more-vert" class="text-lg" />
	</button>
	<ul class="p-2 border shadow menu bg-base-200 rounded-box w-52">
		{#each actions as action}
			{#if 'divider' in action}
				<div class="mx-2 my-0 divider" />
			{:else}
				<!-- svelte-ignore a11y-invalid-attribute -->
				<li>
					<a href={action.href || '#'} class="text-sm font-normal" on:click={onClick(action)}>
						<Icon icon={action.icon} class="text-xl" />
						<span>{action.text}</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</BaseDropdown>

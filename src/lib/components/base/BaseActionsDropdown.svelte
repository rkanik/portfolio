<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import BaseDropdown from './BaseDropdown.svelte'
	import Icon from '@iconify/svelte'

	type Action =
		| { divider: true }
		| {
				text: string
				event: string
				icon: string
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
			if ('event' in action) {
				dispatch(action.event, item)
			}
		}
	}
</script>

<BaseDropdown {...$$props}>
	<button slot="activator" class="btn btn-sm btn-circle">
		<Icon icon="material-symbols:more-vert" class="text-lg" />
	</button>
	<ul class="menu p-2 shadow bg-base-200 border rounded-box w-52">
		{#each actions as action}
			{#if 'divider' in action}
				<div class="divider my-0 mx-2" />
			{:else}
				<!-- svelte-ignore a11y-invalid-attribute -->
				<li>
					<a href="#" class="text-sm font-normal" on:click={onClick(action)}>
						<Icon icon={action.icon} class="text-xl" />
						<span>{action.text}</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</BaseDropdown>

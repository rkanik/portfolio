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
	<svelte:fragment slot="activator" let:onClick>
		<button type="button" class="btn btn-sm btn-circle" on:click={onClick}>
			<Icon icon="material-symbols:more-vert" class="text-lg" />
		</button>
	</svelte:fragment>
	<ul class="p-2 border shadow menu bg-gray-600 rounded-lg w-52 border-gray-500">
		{#each actions as action}
			{#if 'divider' in action}
				<hr class="mx-2 my-0 inline-block !border-gray-500" />
			{:else}
				<!-- svelte-ignore a11y-invalid-attribute -->
				<li>
					<a
						href={action.href || 'javascript:void(0)'}
						class="text-sm font-normal"
						on:click={onClick(action)}
					>
						<Icon icon={action.icon} class="text-xl" />
						<span>{action.text}</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</BaseDropdown>

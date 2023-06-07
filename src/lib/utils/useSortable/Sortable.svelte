<script lang="ts">
	import type { Optional } from '$lib/types'
	import type { Writable } from 'svelte/store'
	import type { SortableOptions } from 'sortablejs'

	import { useSortable, type OnUpdatedHandler } from '.'
	import { writable } from 'svelte/store'

	export let tag: string = 'div'
	export let items: unknown[] | Writable<unknown[]>
	export let options: SortableOptions = {}
	export let onUpdated: Optional<OnUpdatedHandler> = undefined

	let element: HTMLElement
	const innerItems = Array.isArray(items) ? writable(items) : items

	if (Array.isArray(items)) {
		innerItems.subscribe(($innerItems) => {
			items = $innerItems
		})
	}

	const sortable = useSortable({
		items: innerItems,
		onUpdated,
		element: () => element,
		...options
	})
</script>

<svelte:element this={tag} bind:this={element} class={$$props.class}>
	<slot {sortable} {element} />
</svelte:element>

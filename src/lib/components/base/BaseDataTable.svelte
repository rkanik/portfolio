<script lang="ts">
	import type { Optional } from '$lib/types'
	import type { SortableOptions } from 'sortablejs'
	import type { OnUpdatedHandler } from '$lib/utils/useSortable'
	import Sortable from '$lib/utils/useSortable/Sortable.svelte'

	type DataTableHeader = {
		text: string
		value: string | ((item: any, header: DataTableHeader) => string)
	}

	export let actions = false
	export let selectable = true
	export let items: any[] = []
	export let headers: DataTableHeader[] = []

	export let sortable = false
	export let sortableOptions: SortableOptions = { disabled: !sortable, animation: 150 }
	export let onSortableUpdated: Optional<OnUpdatedHandler> = undefined
</script>

<table class="table w-full base-data-table table-compact">
	<!-- head -->
	<thead>
		<tr>
			{#if selectable}
				<th>
					<label>
						<input type="checkbox" class="checkbox" />
					</label>
				</th>
			{/if}
			{#each headers as header}
				<th>{header.text}</th>
			{/each}
			{#if actions}
				<th />
			{/if}
		</tr>
	</thead>
	<Sortable bind:items tag="tbody" options={sortableOptions} onUpdated={onSortableUpdated}>
		{#each items as item}
			<tr>
				{#if selectable}
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
				{/if}
				{#each headers as header}
					<td>
						<slot
							name="item"
							{item}
							{header}
							value={typeof header.value === 'function'
								? header.value(item, header)
								: item[header.value]}
						>
							{typeof header.value === 'function' ? header.value(item, header) : item[header.value]}
						</slot>
					</td>
				{/each}

				{#if actions}
					<th>
						<slot name="actions" {item} />
					</th>
				{/if}
			</tr>
		{/each}
	</Sortable>
</table>

<style lang="scss">
	.base-data-table :where(th, td) {
		white-space: normal !important;
	}
</style>

<script lang="ts">
	import BasePagination from './BasePagination.svelte'

	import type { Optional } from '$lib/types.js'
	import type { SortableOptions } from 'sortablejs'
	import type { OnUpdatedHandler } from 'sveltuse/dist/integrations/useSortable'

	import SvelteSortable from 'sveltuse/dist/components/SvelteSortable.svelte'

	type Item = $$Generic<Record<string, unknown>>

	type DataTableHeader = {
		text: string
		value: string | ((item: any, header: DataTableHeader) => string)
	}

	export let actions = false
	export let selectable = true
	export let items: Item[] = []
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
	<SvelteSortable bind:items tag="tbody" options={sortableOptions} onUpdated={onSortableUpdated}>
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
	</SvelteSortable>
</table>

<style lang="scss">
	.base-data-table :where(th, td) {
		white-space: normal !important;
	}
</style>

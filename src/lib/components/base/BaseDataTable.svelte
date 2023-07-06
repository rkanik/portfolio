<script lang="ts">
	// import { omitBy } from 'lodash'
	// import { isEmpty } from 'lodash'

	import type { Optional } from '$lib/types.js'
	import type { SortableOptions } from 'sortablejs'
	import type { TTextField } from './BaseForm.svelte'
	import type { OnUpdatedHandler } from 'sveltuse/dist/integrations/useSortable'

	import { useDebounceFn } from 'sveltuse'
	import TextField from './TextField.svelte'
	import SvelteSortable from 'sveltuse/dist/components/SvelteSortable.svelte'

	type Item = $$Generic<Record<string, unknown>>

	type DataTableHeader = {
		text: string
		value: string | ((item: any, header: DataTableHeader) => string)
		search?: TTextField
	}

	export let actions = false
	export let selectable = true
	export let items: Item[] = []
	export let headers: DataTableHeader[] = []

	export let sortable = false
	export let sortableOptions: SortableOptions = { disabled: !sortable, animation: 150 }
	export let onSortableUpdated: Optional<OnUpdatedHandler> = undefined

	// Search
	export let searchDelay: Optional<number> = 500
	export let onSearch: Optional<(fields: Record<string, string>) => void> = undefined

	const getSearch = (headers: DataTableHeader[], searchFields: any = {}) => {
		return headers.reduce((fields, header) => {
			if (!header.search) return fields
			const name = header.search.name
			return { ...fields, [name]: searchFields[name] ?? '' }
		}, {} as Record<string, string>)
	}

	const onChangeSearch = useDebounceFn((searchFields) => {
		// if (
		// 	omitBy(searchFields, (value, key) => {
		// 		return isEmpty(value)
		// 	})
		// ) {
		// 	onSearch && onSearch(searchFields)
		// }
		onSearch && onSearch(searchFields)
	}, searchDelay)

	let searchFields = getSearch(headers)
	$: {
		searchFields = getSearch(headers, searchFields)
	}
	$: {
		onChangeSearch(searchFields)
	}
	// End Search
</script>

<!-- <form use:form> -->
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
		<tr>
			{#if selectable}
				<td class="border-t border-solid border-white" />
			{/if}
			{#each headers as header}
				<td class="border-t border-solid border-white">
					{#if 'search' in header && header.search}
						<TextField
							{...header.search}
							bind:value={searchFields[header.search.name]}
							inputClass="input-sm"
						/>
					{/if}
				</td>
			{/each}
			{#if actions}
				<td class="border-t border-solid border-white" />
			{/if}
			<td />
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

<!-- </form> -->
<style lang="scss">
	.base-data-table :where(th, td) {
		white-space: normal !important;
	}
</style>
-
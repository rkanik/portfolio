<script lang="ts">
	type DataTableHeader = {
		text: string
		value: string | ((item: any, header: DataTableHeader) => string)
	}

	type T = $$Generic<any>

	export let actions = false
	export let selectable = true
	export let items: T[] = []
	export let headers: DataTableHeader[] = []
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
	<tbody>
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
	</tbody>
</table>

<style lang="scss">
	.base-data-table :where(th, td) {
		white-space: normal !important;
	}
</style>

<script lang="ts">
	import { writable } from 'svelte/store'
	import SvelteSortable from 'sveltuse/dist/components/SvelteSortable.svelte'

	// import { SvelteSortable } from 'sveltuse/components'
	// import { SvelteSortable } from 'sveltuse/dist/components'
	// import SvelteSortable from 'sveltuse/SvelteSortable.svelte'

	let items = [...Array(5).keys()].map((index) => ({
		name: `Item ${index + 1}`
	}))

	const items2 = writable(
		[...Array(5).keys()].map((index) => ({
			name: `[L2] Item ${index + 1}`
		}))
	)
</script>

<div class="container mx-auto py-12 grid grid-cols-2 gap-8">
	<div class="flex flex-col space-y-8">
		<SvelteSortable
			bind:items
			tag="ul"
			class="flex flex-col space-y-2"
			options={{ animation: 150, group: 'items' }}
		>
			{#each items as item}
				<li class="px-4 py-2 bg-base-200 rounded">
					{item.name}
				</li>
			{/each}
		</SvelteSortable>

		<SvelteSortable
			items={items2}
			tag="ul"
			class="flex flex-col space-y-2"
			options={{ animation: 150, group: 'items' }}
		>
			{#each $items2 as item}
				<li class="px-4 py-2 bg-base-100 rounded">
					{item.name}
				</li>
			{/each}
		</SvelteSortable>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<pre><code>{JSON.stringify(items, null, 1)}</code></pre>
		<pre><code>{JSON.stringify($items2, null, 1)}</code></pre>
	</div>
</div>

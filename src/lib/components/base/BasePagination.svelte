<script>
	import { useOffsetPagination } from 'sveltuse/dist/core/useOffsetPagination'
	import BaseJson from './BaseJson.svelte'
	import cn from '$lib/utils/cn'
	import { number } from 'zod'

	const { pages, page, lastPage, isFirstPage, isLastPage, prev, next } = useOffsetPagination({
		page: 99,
		total: 1057,
		perPage: 10,
		totalVisible: 7,
		onChange(v) {
			console.log(v)
		}
	})
</script>

<div>
	<div class="btn-group">
		<button
			class={cn('btn', { 'btn-disabled': $isFirstPage })}
			on:click={() => {
				page.set(1)
			}}
		>
			{`<<`}
		</button>
		<button class={cn('btn', { 'btn-disabled': $isFirstPage })} on:click={prev}>{`<`}</button>
		{#each $pages as item}
			<button
				class={cn('btn', {
					'btn-active': item === $page,
					'btn-disabled': item === '...'
				})}
				on:click={() => {
					if (typeof item === 'number') {
						page.set(item)
					}
				}}>{item}</button
			>
		{/each}
		<button class={cn('btn', { 'btn-disabled': $isLastPage })} on:click={next}>{`>`}</button>
		<button class={cn('btn', { 'btn-disabled': $isLastPage })} on:click={() => page.set($lastPage)}
			>{`>>`}</button
		>
	</div>
</div>

<script lang="ts">
	import type { AnyFn } from '$lib/types'

	import cn from '$lib/utils/cn'

	import { noop } from 'svelte/internal'
	import { useOffsetPagination } from 'sveltuse/dist/core/useOffsetPagination'

	export let onChange: AnyFn = noop
	export let page = 1
	export let total = 10
	export let perPage = 10
	export let totalVisible = 7

	const {
		pages,
		page: currentPage,
		total: currentTotal,
		perPage: currentPerPage,
		isFirstPage,
		isLastPage,
		gotoFirstPage,
		gotoPreviousPage,
		goto,
		gotoNextPage,
		gotoLastPage
	} = useOffsetPagination({
		page,
		total,
		perPage,
		totalVisible,
		onChange
	})

	$: {
		console.log($currentPage, $currentPerPage, $currentTotal)
	}

	$: {
		goto(page)
	}

	$: {
		currentTotal.set(total)
	}

	$: {
		currentPerPage.set(perPage)
	}
</script>

<div class={cn('btn-group', $$props.class)}>
	<button class={cn('btn', { 'btn-disabled': $isFirstPage })} on:click={gotoFirstPage}>
		{`<<`}
	</button>
	<button class={cn('btn', { 'btn-disabled': $isFirstPage })} on:click={gotoPreviousPage}>
		{`<`}
	</button>

	{#each $pages as page}
		<button
			class={cn('btn', {
				'btn-active': page === $currentPage,
				'btn-disabled': page === '...'
			})}
			on:click={() => goto(page)}
		>
			{page}
		</button>
	{/each}

	<button class={cn('btn', { 'btn-disabled': $isLastPage })} on:click={gotoNextPage}>{`>`}</button>
	<button class={cn('btn', { 'btn-disabled': $isLastPage })} on:click={gotoLastPage}>{`>>`}</button>
</div>

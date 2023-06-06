<script lang="ts">
	import type { TTestimonial } from '$lib/types'
	import { browser } from '$app/environment'

	import Icon from '@iconify/svelte'
	import Carousel from 'svelte-carousel'
	import useBreakpoints from '$lib/composable/useBreakpoints'

	const breakpoints = useBreakpoints()
	let particlesToShow: number = 4

	$: {
		particlesToShow =
			(
				{
					xs: 1,
					sm: 1,
					md: 2,
					lg: 3
				} as any
			)[$breakpoints.name] || 4
	}

	let carousel: Carousel
	export let testimonials: TTestimonial[] = []
</script>

{#if browser}
	<Carousel
		bind:this={carousel}
		dots
		autoplay
		pauseOnFocus
		infinite={false}
		{particlesToShow}
		particlesToScroll={1}
		let:showPrevPage
		let:showNextPage
		let:currentPageIndex
	>
		<button
			slot="prev"
			disabled={currentPageIndex === 0}
			class="absolute btn btn-circle btn-outline btn-sm right-10 -bottom-5"
			on:click={showPrevPage}
		>
			<Icon icon="material-symbols:chevron-left-rounded" class="text-lg" />
		</button>
		<button
			slot="next"
			disabled={currentPageIndex === testimonials.length - 3}
			class="absolute right-0 btn btn-circle btn-outline btn-sm -bottom-5"
			on:click={showNextPage}
		>
			<Icon icon="material-symbols:chevron-right-rounded" class="text-lg" />
		</button>

		{#each testimonials as testimonial}
			<div class="h-full p-4">
				<slot name="item" {testimonial} />
			</div>
		{/each}
	</Carousel>
{/if}

<script lang="ts">
	import type { TTestimonial } from '$lib/types'
	import Icon from '@iconify/svelte'
	import { browser } from '$app/environment'
	import Carousel from 'svelte-carousel'
	import { breakpointsTailwind, useBreakpoints } from 'sveltuse'

	const breakpoints = useBreakpoints(breakpointsTailwind)
	const smAndDown = breakpoints.smaller('sm')
	const lgAndDown = breakpoints.smaller('xl')
	const mdAndDown = breakpoints.smaller('lg')

	let particlesToShow: number = 4

	$: {
		particlesToShow = $smAndDown ? 1 : $mdAndDown ? 2 : $lgAndDown ? 3 : 4
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
		<!-- disabled={currentPageIndex === 0}
	on:click={showPrevPage} -->
		<button
			slot="prev"
			class="btn btn-circle btn-outline btn-sm absolute -bottom-5 right-10"
		>
			<Icon icon="material-symbols:chevron-left-rounded" class="text-lg" />
		</button>
		<!-- disabled={currentPageIndex === testimonials.length - 3}
		on:click={showNextPage} -->
		<button
			slot="next"
			class="btn btn-circle btn-outline btn-sm absolute -bottom-5 right-0"
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

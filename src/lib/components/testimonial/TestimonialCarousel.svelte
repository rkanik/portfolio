<script lang="ts">
	import type { TUserTestimonial } from '$lib/types'
	import { browser } from '$app/environment'

	import Icon from '@iconify/svelte'
	import Carousel from 'svelte-carousel'

	let carousel: Carousel
	export let userTestimonials: TUserTestimonial[] = []
</script>

{#if browser}
	<Carousel
		bind:this={carousel}
		dots
		autoplay
		pauseOnFocus
		infinite={false}
		particlesToShow={4}
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
			disabled={currentPageIndex === userTestimonials.length - 3}
			class="absolute right-0 btn btn-circle btn-outline btn-sm -bottom-5"
			on:click={showNextPage}
		>
			<Icon icon="material-symbols:chevron-right-rounded" class="text-lg" />
		</button>

		{#each userTestimonials as userTestimonial, index}
			<div class="h-full p-4">
				<slot name="item" {userTestimonial} />
			</div>
		{/each}
	</Carousel>
{/if}

<script lang="ts">
	import { browser } from '$app/environment'

	import Carousel from 'svelte-carousel'
	import testimonials from '$lib/json/testimonials.json'
	import cn from '$lib/utils/cn'
	import { onMount } from 'svelte'

	let carousel: Carousel
	let avatarCarousel: Carousel

	let mounted = false
	onMount(() => {
		mounted = true
	})

	const handleNextClick = () => {
		carousel.goToNext()
	}
</script>

{#if browser}
	<Carousel
		bind:this={carousel}
		dots={false}
		pauseOnFocus
		particlesToShow={3}
		particlesToScroll={1}
		let:currentPageIndex
	>
		<!-- on:pageChange={(event) => {
			avatarCarousel.goTo(event.detail - 2)
		}} -->
		{#each testimonials as testimonial, index}
			<div class="flex items-center h-full px-5 py-5">
				<div
					class={cn('p-5 text-center shadow-lg rounded-xl', {
						'bg-primary': currentPageIndex === index - 1,
						'bg-base-100': currentPageIndex !== index - 1
					})}
				>
					{currentPageIndex === index - 1
						? `${index - 1} - ${currentPageIndex} - ${testimonial.name}`
						: ''}
					<p>
						{testimonial.feedback}
					</p>
					<h4 class="mt-4 text-lg font-medium">
						{testimonial.name}
					</h4>
					<div class="text-sm opacity-50">{testimonial.address}</div>
				</div>
			</div>
		{/each}
		<div slot="dots" />
	</Carousel>
	<div class="mx-auto w-96">
		<Carousel
			bind:this={avatarCarousel}
			dots={false}
			arrows={false}
			pauseOnFocus
			particlesToShow={5}
			particlesToScroll={1}
			initialPageIndex={-1}
			let:currentPageIndex
			on:pageChange={(event) => {
				console.log(event.detail, mounted, carousel)
				carousel.goTo(event.detail + 1)
			}}
		>
			{#each testimonials as testimonial, index}
				<button
					class={cn('relative flex justify-center items-center h-32 flex-col ')}
					on:click={() => {
						avatarCarousel.goTo(index - 2)
					}}
				>
					<img
						alt={testimonial.name}
						src={testimonial.avatar}
						class={cn(
							'object-cover object-center rounded-full transition-all ease-in-out',
							currentPageIndex !== index - 2
								? Math.abs(index - 2 - currentPageIndex) === 1
									? 'w-12 h-12 opacity-50'
									: 'w-10 h-10 opacity-20'
								: '',
							{
								'w-16 h-16': currentPageIndex === index - 2
							}
						)}
					/>
					{currentPageIndex === index - 2
						? `${index - 2} - ${currentPageIndex} - ${testimonial.name}`
						: ''}
					<!-- <div class="absolute inset-0 flex items-center justify-center bg-red-50">
						{index - 2 - currentPageIndex}
					</div> -->
				</button>
			{/each}
		</Carousel>
	</div>
{/if}

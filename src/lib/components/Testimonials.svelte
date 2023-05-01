<script lang="ts">
	import { browser } from '$app/environment'

	import Carousel from 'svelte-carousel'
	import testimonials from '$lib/json/testimonials.json'
	import cn from '$lib/utils/cn'
	import { onMount } from 'svelte'
	import Icon from '@iconify/svelte'

	let carousel: Carousel
	let avatarCarousel: Carousel

	let isInteracted = false

	const onClickWindow = () => {
		isInteracted = true
		window.removeEventListener('click', onClickWindow)
	}

	onMount(() => {
		window.addEventListener('click', onClickWindow)
	})
</script>

{#if browser}
	<Carousel
		bind:this={carousel}
		dots={false}
		pauseOnFocus
		particlesToShow={3}
		particlesToScroll={1}
		let:currentPageIndex
		on:pageChange={(event) => {
			if (isInteracted) {
				avatarCarousel.goTo(event.detail - 1)
			}
		}}
	>
		{#each testimonials as testimonial, index}
			<div
				class={cn('flex items-center h-full', {
					'p-5': currentPageIndex === index - 1,
					'px-5 py-16': currentPageIndex !== index - 1
				})}
			>
				<div
					class={cn(
						'p-5 w-full text-center rounded-xl flex flex-col items-center justify-end transition-colors',
						{
							'bg-primary shadow-lg': currentPageIndex === index - 1,
							'bg-gradient-to-l from-base-300 to-base-100': currentPageIndex < index - 1,
							'bg-gradient-to-r from-base-300 to-base-100': currentPageIndex > index - 1
						}
					)}
				>
					<p class="relative py-20">
						<Icon
							class="absolute top-0 -left-8 transform rotate-180 opacity-30 text-[150px] mix-blend-multiply transition-all"
							icon="material-symbols:format-quote-rounded"
						/>
						{testimonial.feedback}
						<Icon
							class="absolute -right-8 bottom-0 opacity-30 text-[150px] mix-blend-multiply transition-all"
							icon="material-symbols:format-quote-rounded"
						/>
					</p>

					<div class="w-8 mx-auto my-0 divider" />
					<h4 class="text-lg font-medium">
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
				if (isInteracted) {
					carousel.goTo(event.detail + 1)
				}
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
					<!-- {currentPageIndex === index - 2
						? `${index - 2} - ${currentPageIndex} - ${testimonial.name}`
						: ''} -->
					<!-- <div class="absolute inset-0 flex items-center justify-center bg-red-50">
						{index - 2 - currentPageIndex}
					</div> -->
				</button>
			{/each}
		</Carousel>
	</div>
{/if}

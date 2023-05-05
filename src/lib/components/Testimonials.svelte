<script lang="ts">
	import { browser } from '$app/environment'

	import Carousel from 'svelte-carousel'
	import testimonials from '$lib/json/testimonials.json'
	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	let carousel: Carousel
</script>

{#if browser}
	<Carousel
		bind:this={carousel}
		dots
		autoplay
		pauseOnFocus
		infinite={false}
		particlesToShow={3}
		particlesToScroll={1}
		let:showPrevPage
		let:showNextPage
		let:currentPageIndex
	>
		<button
			slot="prev"
			disabled={currentPageIndex === 0}
			class="btn btn-circle btn-outline btn-sm absolute right-10 -bottom-5"
			on:click={showPrevPage}
		>
			<Icon icon="material-symbols:chevron-left-rounded" class="text-lg" />
		</button>
		<button
			slot="next"
			disabled={currentPageIndex === testimonials.length - 3}
			class="btn btn-circle btn-outline btn-sm absolute right-0 -bottom-5"
			on:click={showNextPage}
		>
			<Icon icon="material-symbols:chevron-right-rounded" class="text-lg" />
		</button>

		{#each testimonials as testimonial, index}
			<div
				class={cn('flex flex-col h-full transition-all', {
					'p-5': currentPageIndex === index - 1,
					'px-5 py-20': currentPageIndex !== index - 1
				})}
			>
				<div
					class={cn(
						'flex-1 p-5 w-full text-center rounded-xl flex flex-col items-center justify-end transition-colors',
						{
							'bg-primary shadow-lg': currentPageIndex === index - 1,
							'bg-base-100': currentPageIndex !== index - 1
						}
					)}
				>
					<p class="relative px-5 flex-1 flex justify-center items-center">
						<!-- <Icon
							class="absolute top-0 -left-8 transform rotate-180 opacity-30 text-[150px] mix-blend-multiply transition-all"
							icon="material-symbols:format-quote-rounded"
						/> -->
						{testimonial.feedback}
						<!-- <Icon
							class="absolute -right-8 bottom-0 opacity-30 text-[150px] mix-blend-multiply transition-all"
							icon="material-symbols:format-quote-rounded"
						/> -->
					</p>

					<div class="avatar">
						<div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
							<img alt={testimonial.name} src={testimonial.avatar} />
						</div>
					</div>

					<div class="w-8 mx-auto my-0 divider" />

					<h4 class="text-lg font-medium">
						{testimonial.name}
					</h4>
					<div class="text-sm opacity-50">{testimonial.address}</div>
				</div>
			</div>
		{/each}
	</Carousel>
{/if}

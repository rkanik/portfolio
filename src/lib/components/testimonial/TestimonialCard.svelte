<script lang="ts">
	import type { TTestimonial } from '$lib/types'
	import cn from '$lib/utils/cn'
	import { getPublicUrl } from '$lib/utils/getPublicUrl'
	import src from '$lib/utils/src'
	import Icon from '@iconify/svelte'
	import BaseImage from '../base/BaseImage.svelte'

	export let testimonial: TTestimonial
</script>

<div
	class="flex flex-col flex-1 w-full p-5 transition-colors border-white rounded-xl card card-bordered bg-base-100 border-opacity-10"
>
	<Icon
		icon="material-symbols:format-quote-rounded"
		class="-ml-2 text-5xl transition-all transform rotate-180 text-opacity-80 text-secondary"
	/>

	<p class="relative flex-1 mt-2 text-base leading-snug">
		{testimonial.testimonial}
	</p>

	<div class="flex space-x-1 mt-2">
		{#each [...Array(5).keys()] as index}
			<Icon
				icon={testimonial.rating > index ? 'ic:outline-star' : 'ic:outline-star-border'}
				class={cn('text-lg', testimonial.rating > index ? 'text-orange-400' : '')}
			/>
		{/each}
	</div>

	<div class="flex mt-4 space-x-4">
		<div class="flex-none mt-1 avatar placeholder">
			<div
				class="w-10 h-10 bg-base-300 text-neutral-content rounded-full ring ring-secondary ring-opacity-75 ring-offset-base-100 ring-offset-2"
			>
				{#if testimonial.avatar}
					{@const src = getPublicUrl(testimonial.avatar)}
					<BaseImage
						lazySrc={src}
						alt={testimonial.avatar?.name}
						src={testimonial.avatar.base64 || src}
					/>
				{:else}
					<span class="text-sm font-medium uppercase">{testimonial.name.substring(0, 2)}</span>
				{/if}
			</div>
		</div>
		<div class="flex-1">
			<h4 class="text-base font-medium">
				{testimonial.name}
			</h4>
			<div class="text-sm opacity-50">{testimonial.company}</div>
		</div>
	</div>
</div>

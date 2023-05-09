<script lang="ts">
	import type { TUserTestimonial } from '$lib/types'
	import cn from '$lib/utils/cn'
	import src from '$lib/utils/src'
	import Icon from '@iconify/svelte'
	import truncate from 'lodash/truncate'

	export let userTestimonial: TUserTestimonial
	const { testimonials: testimonial } = userTestimonial
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

	<div class="flex mt-4 space-x-4">
		<div class="flex-none mt-1 avatar">
			<div
				class="w-10 h-10 rounded-full ring ring-secondary ring-opacity-75 ring-offset-base-100 ring-offset-2"
			>
				<img alt={testimonial.name} src={src(testimonial.avatar)} />
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

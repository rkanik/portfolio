<script lang="ts">
	import type { TTestimonial } from '$lib/types'
	import BaseSection from '../base/BaseSection.svelte'
	import TestimonialCard from './TestimonialCard.svelte'
	import TestimonialCarousel from './TestimonialCarousel.svelte'

	export let testimonials: TTestimonial[]
</script>

<BaseSection
	class={$$props.class}
	subheader="Testimonials"
	title="What people says about me."
	description="Et eirmod nibh ea kasd et accumsan nonumy. At clita ea ut sit ipsum amet accusam ipsum rebum magna. Vero sed et eu est et eum ea sanctus elitr dolor amet feugait zzril. Rebum iriure blandit gubergren nibh stet lorem et sit nibh tempor et sed lorem gubergren sit sed eirmod. Ex gubergren ipsum aliquip takimata dolore clita vero diam labore et sed sea."
>
	<div class="pt-8 pb-16">
		<TestimonialCarousel {testimonials}>
			<svelte:fragment slot="item" let:testimonial>
				<TestimonialCard {testimonial} />
			</svelte:fragment>
		</TestimonialCarousel>
	</div>
</BaseSection>

<script lang="ts">
	import type { TTestimonial } from '$lib/types'
	import TestimonialSection from '$lib/components/testimonial/TestimonialSection.svelte'

	export let data
	const testimonials = (data.testimonials.data || []) as TTestimonial[]
</script>

<svelte:head>
	<title>Testimonials | Rasel Khandkar</title>
</svelte:head>

<TestimonialSection {testimonials} />

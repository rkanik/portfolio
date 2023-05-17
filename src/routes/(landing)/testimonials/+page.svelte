<script lang="ts">
	import type { TUserTestimonial } from '$lib/types'
	import TestimonialSection from '$lib/components/testimonial/TestimonialSection.svelte'

	export let data
	const userTestimonials = (data.userTestimonials.data || []) as TUserTestimonial[]
</script>

<svelte:head>
	<title>Testimonials | Rasel Khandkar</title>
</svelte:head>

<TestimonialSection {userTestimonials} />

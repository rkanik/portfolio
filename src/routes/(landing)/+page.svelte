<script lang="ts">
	import AboutMe from '$lib/components/AboutMe.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Projects from '$lib/components/Projects.svelte'
	// import RandomizePosition from '$lib/components/RandomizePosition.svelte'
	import BaseSection from '$lib/components/base/BaseSection.svelte'
	import EducationSection from '$lib/components/education/EducationSection.svelte'
	import ExperienceSection from '$lib/components/experience/ExperienceSection.svelte'
	import TestimonialSection from '$lib/components/testimonial/TestimonialSection.svelte'
	import type { TTestimonial } from '$lib/types.js'
	import Icon from '@iconify/svelte'

	// import rocketImage from '$lib/assets/img/rocket-small.webp'
	import ContactMeSection from '$lib/components/contact/ContactMeSection.svelte'

	export let data
	const testimonials = (data.testimonials.data || []) as TTestimonial[]
</script>

<svelte:head>
	<title>Rasel Khandkar</title>
</svelte:head>

<div class="overflow-hidden">
	<HeroSection class="pt-20" />

	<div class="container flex items-center justify-center min-h-screen px-4 mx-auto md:px-0">
		<div class="w-full py-16">
			<AboutMe />
		</div>
	</div>

	<Projects max={4} projects={data.projects.data} userTechnologies={data.userTechnologies} />
	<TestimonialSection {testimonials} />

	<ExperienceSection class="pt-20" experiences={data.publicUser.profile?.experiences || []} />
	<EducationSection educations={data.publicUser.profile?.educations || []} />

	<BaseSection subheader="Technologies" title="Tools & Technologies that I can work on">
		<!-- <RandomizePosition items={data.userTechnologies.data || []} let:item class="mt-16">
			<div slot="item" class="flex flex-col items-center justify-center">
				<Icon icon={item.technologies?.icon} class="text-6xl" />
				<div class="mt-2 text-xs tracking-wider uppercase">{item.technologies?.name}</div>
			</div>
		</RandomizePosition> -->

		{#if !data.userTechnologies.error}
			<div class="max-w-5xl mx-auto mt-8">
				<div class="flex flex-wrap justify-center">
					{#each data.userTechnologies.data as tech}
						<div class="flex flex-col items-center justify-center w-32 h-32 p-5 hover:bg-base-100">
							<Icon icon={tech.technologies?.icon} class="text-6xl" />
							<div class="mt-2 text-xs tracking-wider uppercase">{tech.technologies?.name}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</BaseSection>

	<ContactMeSection class="pt-64 pb-64" />
</div>

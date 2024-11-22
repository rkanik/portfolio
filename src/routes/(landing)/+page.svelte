<script lang="ts">
	import type { TTestimonial } from '$lib/types'
	import Icon from '@iconify/svelte'
	import AboutMe from '$lib/components/AboutMe.svelte'
	import BaseSection from '$lib/components/base/BaseSection.svelte'
	import ContactMeSection from '$lib/components/contact/ContactMeSection.svelte'
	import EducationSection from '$lib/components/education/EducationSection.svelte'
	import ExperienceSection from '$lib/components/experience/ExperienceSection.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Projects from '$lib/components/Projects.svelte'
	import TestimonialSection from '$lib/components/testimonial/TestimonialSection.svelte'

	// import rocketImage from '$lib/assets/img/rocket-small.webp'
	// import RandomizePosition from '$lib/components/RandomizePosition.svelte'

	export let data
	$: testimonials = (data.testimonials.data || []) as TTestimonial[]
</script>

<svelte:head>
	<title>Rasel Khandkar</title>
</svelte:head>

<div class="overflow-hidden">
	<HeroSection class="pt-20" />

	<div
		class="container mx-auto flex min-h-screen items-center justify-center px-4 md:px-0"
	>
		<div class="w-full py-16">
			<AboutMe />
		</div>
	</div>

	<Projects max={8} projects={data.projects.data} />
	<TestimonialSection {testimonials} />

	<ExperienceSection
		class="pt-20"
		experiences={data.publicUser.profile?.experiences || []}
	/>
	<EducationSection educations={data.publicUser.profile?.educations || []} />

	<BaseSection
		subheader="Technologies"
		title="Tools & Technologies that I can work on"
	>
		<!-- <RandomizePosition items={data.userTechnologies.data || []} let:item class="mt-16">
			<div slot="item" class="flex flex-col items-center justify-center">
				<Icon icon={item.technologies?.icon} class="text-6xl" />
				<div class="mt-2 text-xs tracking-wider uppercase">{item.technologies?.name}</div>
			</div>
		</RandomizePosition> -->

		{#if Array.isArray(data.userTechnologies.data)}
			<div class="mx-auto mt-8 max-w-5xl">
				<div class="flex flex-wrap justify-center">
					{#each data.userTechnologies.data as tech}
						<div
							class="flex h-32 w-32 flex-col items-center justify-center p-5 hover:bg-base-100"
						>
							<Icon icon={tech.technologies?.icon} class="text-6xl" />
							<div class="mt-2 text-xs uppercase tracking-wider">
								{tech.technologies?.name}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</BaseSection>

	<ContactMeSection class="pb-64 pt-64" />
</div>

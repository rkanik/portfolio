<script lang="ts">
	import AboutMe from '$lib/components/AboutMe.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Projects from '$lib/components/Projects.svelte'
	import RandomizePosition from '$lib/components/RandomizePosition.svelte'
	import BaseSection from '$lib/components/base/BaseSection.svelte'
	import EducationSection from '$lib/components/education/EducationSection.svelte'
	import ExperienceSection from '$lib/components/experience/ExperienceSection.svelte'
	import TestimonialSection from '$lib/components/testimonial/TestimonialSection.svelte'
	import type { TUserTestimonial } from '$lib/types.js'
	import Icon from '@iconify/svelte'

	import rocketImage from '$lib/assets/img/rocket-small.webp'

	export let data
	const userTestimonials = (data.userTestimonials.data || []) as TUserTestimonial[]
</script>

<svelte:head>
	<title>Rasel Khandkar</title>
</svelte:head>

<div class="overflow-hidden">
	<HeroSection />

	<div class="container flex items-center justify-center min-h-screen px-4 mx-auto md:px-0">
		<div class="w-full py-16">
			<AboutMe />
		</div>
	</div>

	<Projects max={4} projects={data.projects} userTechnologies={data.userTechnologies} />
	<TestimonialSection {userTestimonials} />

	<ExperienceSection class="pt-20" experiences={data.publicUser.profile?.experiences || []} />
	<EducationSection educations={data.publicUser.profile?.educations || []} />

	<BaseSection subheader="Technologies" title="Tools & Technologies that I can work on">
		<RandomizePosition items={data.userTechnologies.data || []} let:item class="mt-16">
			<div slot="item" class="flex flex-col items-center justify-center">
				<Icon icon={item.technologies?.icon} class="text-6xl" />
				<div class="mt-2 text-xs tracking-wider uppercase">{item.technologies?.name}</div>
			</div>
		</RandomizePosition>

		<!-- {#if !data.userTechnologies.error}
				<div class="max-w-5xl mx-auto mt-8">
					<div class="flex flex-wrap justify-center">
						{#each data.userTechnologies.data as tech}
							<div
								class="flex flex-col items-center justify-center w-32 h-32 p-5 hover:bg-base-100"
							>
								<Icon icon={tech.technologies?.icon} class="text-6xl" />
								<div class="mt-2 text-xs tracking-wider uppercase">{tech.technologies?.name}</div>
							</div>
						{/each}
					</div>
				</div>
			{/if} -->
	</BaseSection>

	<div class="container mx-auto py-16 relative flex items-center">
		<!-- <div
			class="w-32 h-32 bg-red-900 rounded-full absolute blur-[96px] z-0 bottom-0 top-1/2 left-2/3"
		/> -->
		<div
			class="rounded-xl overflow-hidden relative bg-base-100 border border-white border-opacity-10 p-4 md:p-12 lg:p-16 xl:p-20 flex justify-between bg-opacity-95 backdrop-blur w-full"
		>
			<div class="flex items-center">
				<div class="max-w-xl">
					<h2 class="text-5xl font-bold">Start a project</h2>
					<div class="text-lg mt-4">
						Interested in working together? We should queue up a time to chat. <br /> I’ll buy the coffee.
					</div>
					<button class="btn btn-primary rounded-full px-8 mt-4 lg:mt-8 text-sm">
						Contact me
					</button>
				</div>
			</div>

			<img
				alt="Rocket"
				width="300"
				height="300"
				src={rocketImage}
				class="object-cover object-center rounded-xl"
			/>
		</div>
	</div>
</div>

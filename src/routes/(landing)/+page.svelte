<script lang="ts">
	import AboutMe from '$lib/components/AboutMe.svelte'
	import EduationAndExperiences from '$lib/components/EduationAndExperiences.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Projects from '$lib/components/Projects.svelte'
	import RandomizePosition from '$lib/components/RandomizePosition.svelte'
	import Testimonials from '$lib/components/Testimonials.svelte'
	import Icon from '@iconify/svelte'

	export let data
</script>

<svelte:head>
	<title>RK Anik</title>
</svelte:head>

<div class="overflow-hidden">
	<HeroSection />

	<div class="container flex items-center justify-center min-h-screen px-4 mx-auto md:px-0">
		<div class="w-full py-16">
			<AboutMe />
		</div>
	</div>

	<Projects max={4} projects={data.projects} userTechnologies={data.userTechnologies} />

	<div class="container flex items-center justify-center min-h-screen mx-auto">
		<div class="w-full py-16">
			<h2 class="mb-8 text-2xl font-bold text-center">Testimonials</h2>
			<div class="min-h-[32rem]">
				<Testimonials />
			</div>
		</div>
	</div>

	<div class="container flex items-center justify-center min-h-screen mx-auto">
		<div class="w-full py-16">
			<h2 class="mb-8 text-2xl font-bold text-center">Eduation And Experiences</h2>
			<div class="flex items-center justify-center">
				<EduationAndExperiences />
			</div>
		</div>
	</div>

	<div class="container flex items-center justify-center min-h-screen px-4 mx-auto md:px-0">
		<div class="w-full py-16">
			<h2 class="mb-16 text-2xl font-bold text-center">Tools And Technologies</h2>

			<RandomizePosition items={data.userTechnologies.data || []} let:item>
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
		</div>
	</div>

	<div class="min-h-screen hero bg-base-200">
		<div class="flex-col hero-content lg:flex-row-reverse">
			<img
				alt="Hero"
				class="max-w-sm rounded-lg shadow-2xl"
				src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
			/>
			<div>
				<h1 class="text-5xl font-bold">Box Office News!</h1>
				<p class="py-6">
					Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
					exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
				</p>
				<button class="btn btn-primary">Get Started</button>
			</div>
		</div>
	</div>
</div>

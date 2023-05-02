<script lang="ts">
	import EduationAndExperiences from '$lib/components/EduationAndExperiences.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Testimonials from '$lib/components/Testimonials.svelte'
	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import src from '$lib/utils/src.js'
	import Icon from '@iconify/svelte'

	export let data
</script>

<svelte:head>
	<title>RK Anik</title>
</svelte:head>

<div>
	<HeroSection />

	<div class="container mx-auto">
		<div class="py-16">
			<h2 class="text-2xl font-bold text-center">Projects</h2>
			<div class="grid grid-cols-4 gap-8 mt-16">
				{#each data.projects.data || [] as project}
					<div class="overflow-hidden card glass">
						<div class="relative h-64 overflow-hidden">
							<img
								alt={project.name}
								src={src(project.projectAttachments?.[0]?.attachments?.thumbnail)}
								class="object-cover w-full h-full transition-transform duration-500 ease-in-out transform scale-100 hover:scale-125"
							/>
						</div>
						<div class="card-body">
							<h2 class="flex items-center justify-between card-title">
								<span>{project.name}</span>
								<div class="flex space-x-2">
									{#if project.sourceCodeUrl}
										<a
											class="btn btn-sm btn-circle"
											href={project.sourceCodeUrl}
											target="_blank"
											rel="noreferrer"
										>
											<Icon icon="material-symbols:code" class="text-xl" />
										</a>
									{/if}
									{#if project.previewUrl}
										<a
											class="btn btn-sm btn-circle"
											href={project.previewUrl}
											target="_blank"
											rel="noreferrer"
										>
											<Icon icon="material-symbols:monitor-outline" class="text-xl" />
										</a>
									{/if}
								</div>
							</h2>

							<p>{project.description}</p>

							<div class="mt-2">
								<div class="flex flex-wrap max-w-xs -mt-1 -ml-1">
									{#each project.tags?.split(',') || [] as tag}
										<div class="badge ml-1 mt-1 pb-0.5">{tag}</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

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

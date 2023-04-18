<script lang="ts">
	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import src from '$lib/utils/src.js'
	import Icon from '@iconify/svelte'

	export let data
</script>

<svelte:head>
	<title>RK Anik</title>
</svelte:head>

<div>
	<div class="container mx-auto">
		<div class="py-16">
			<h2 class="text-center text-2xl font-bold">Projects</h2>
			<div class="grid grid-cols-4 mt-16 gap-8">
				{#each data.projects.data || [] as project}
					<div class="card glass overflow-hidden">
						<div class="h-64 relative overflow-hidden">
							<img
								alt={project.name}
								src={src(project.projectAttachments?.[0]?.attachments?.thumbnail)}
								class="object-cover transform scale-100 hover:scale-125 h-full transition-transform duration-500 ease-in-out w-full"
							/>
						</div>
						<div class="card-body">
							<h2 class="card-title flex items-center justify-between">
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
								<div class="flex flex-wrap -ml-1 -mt-1 max-w-xs">
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

	<div class="hero min-h-screen bg-base-200">
		<div class="hero-content flex-col lg:flex-row-reverse">
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

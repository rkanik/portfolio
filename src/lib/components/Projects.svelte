<script lang="ts">
	import src from '$lib/utils/src'
	import Icon from '@iconify/svelte'

	import { getSupabaseContext } from '$lib/store/useSupabase'
	import ProjectCard from './ProjectCard.svelte'
	import BaseModal from './base/BaseModal.svelte'
	import type { TProject } from '$lib/types'
	import BaseJson from './base/BaseJson.svelte'
	import BaseSection from './base/BaseSection.svelte'
	import { useContextStoreContext } from '$lib/store/useContextStore'

	export let projects: any = { data: [] }
	export let userTechnologies: any = { data: [] }
	export let max: number = projects.data.length

	const context = useContextStoreContext()
	const { supabase } = $context

	const onFetchProjects = async () => {
		const technologies = (userTechnologies.data || [])
			?.filter((item: any) => item.active)
			.map((item: any) => item.technologies?.id)

		const query = supabase
			.from('projects')
			.select(
				`*,
				projectAttachments(*,attachments(*)),
				projectTechnologies!inner(*,technologies(*))`
			)
			.eq('status', 'active')
			.order('sortOrder', { ascending: true })

		// FILTER BY SUPABASE QUERY
		// if (technologies.length) {
		// 	query.filter('projectTechnologies.technologyId', 'in', `(${technologies.join(',')})`)
		// 	// query.in('projectTechnologies.technologyId', technologies)
		// 	// query.or(`technologyId.in.(${technologies.join(',')})`, {
		// 	// 	foreignTable: 'projectTechnologies'
		// 	// })
		// }

		projects = await query

		// FILTER LOCALLY
		if (projects.data) {
			projects.data = technologies.length
				? projects.data.filter((project: any) => {
						return project.projectTechnologies?.some((tech: any) => {
							return technologies.includes(tech.technologyId)
						})
				  })
				: projects.data
		}
	}

	let currentProject: TProject = null!
</script>

<BaseSection
	class="py-20"
	subheader="Projects"
	title="Here is some of my Projects"
	description="Welcome to my Portfolio Projects Showcase, where I highlight my most recent and impressive projects. Each project comes with a brief description and a link to the live demo or GitHub repository. I have worked on these projects individually or as part of a team. Whether you are a potential employer, a client, or a fellow developer, I hope these will give you a sense of my capabilities and the kind of work I am passionate about. Feel free to explore and get in touch if you have any questions or would like to discuss potential collaboration opportunities."
>
	<div class="mt-8">
		<div class="flex flex-wrap justify-center -mt-2 -ml-2">
			{#if Array.isArray(userTechnologies.data)}
				{#each userTechnologies.data as item}
					<button
						class="mt-2 ml-2 space-x-2 text-xs font-normal rounded-full btn btn-sm"
						class:btn-primary={item.active}
						class:btn-outline={!item.active}
						on:click={() => {
							item.active = !item.active
							onFetchProjects()
						}}
					>
						<Icon icon={item.technologies?.icon} class="text-base" />
						<span>{item.technologies?.name}</span>
					</button>
				{/each}
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 gap-8 mt-8 md:grid-cols-4">
		{#each (projects.data || []).slice(0, max) as project}
			<ProjectCard {project} on:click={(e) => (currentProject = e.detail)} />
		{/each}
	</div>
	{#if projects.data?.length > max}
		<div class="mt-8 text-center">
			<a href="/projects" class="space-x-2 rounded-full btn btn-outline btn-primary">
				<span>Show more</span>
				<Icon class="text-lg" icon="material-symbols:keyboard-double-arrow-right-rounded" />
			</a>
		</div>
	{/if}
</BaseSection>

<BaseModal
	value={!!currentProject}
	title={currentProject?.name}
	activator={false}
	modalBox="max-w-[100%]"
>
	{#if currentProject}
		<div class="flex min-h-[80vh] space-x-5">
			<div class="flex-none max-w-sm p-5 overflow-auto bg-base-300 rounded-2xl">
				<div class="mb-2 font-medium">Description</div>
				<p>
					{currentProject.description}
				</p>

				<div class="mt-2">
					<div class="mb-2 font-medium">Tools and Technologies</div>
					<div class="flex flex-wrap max-w-xs -mt-1 -ml-1">
						{#if Array.isArray(currentProject.projectTechnologies)}
							{#each currentProject.projectTechnologies as item}
								<div class="badge ml-1 mt-1 pb-0.5 space-x-1 items-center">
									<Icon icon={item.technologies?.icon} class="text-sm mt-0.5" />
									<div>{item.technologies?.name}</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<div class="flex flex-col flex-1">
				<div class="flex items-center flex-none p-2 mb-5 rounded-2xl bg-base-300">
					<div class="px-2 text-base font-medium">Live preview</div>

					<div class="flex ml-auto space-x-1">
						<div class="tooltip tooltip-left tooltip-primary" data-tip="Enter to fullscreen">
							<button class="btn btn-circle btn-sm">
								<Icon class="text-xl" icon="iconamoon:screen-full" />
							</button>
						</div>
						{#if currentProject.sourceCodeUrl}
							<div class="tooltip tooltip-left tooltip-primary" data-tip="View source code">
								<a
									href={currentProject.sourceCodeUrl}
									target="_blank"
									rel="noreferrer"
									class="btn btn-circle btn-sm"
								>
									<Icon class="text-xl" icon="material-symbols:code" />
								</a>
							</div>
						{/if}
						<div class="tooltip tooltip-left tooltip-primary" data-tip="Open in new tab">
							<a
								href={currentProject.previewUrl}
								target="_blank"
								rel="noreferrer"
								class="btn btn-circle btn-sm"
							>
								<Icon class="text-xl" icon="material-symbols:open-in-new-rounded" />
							</a>
						</div>
					</div>
				</div>
				<iframe
					title={currentProject.name}
					src={currentProject.previewUrl}
					frameborder="0"
					class="flex-1 w-full rounded-2xl"
				/>
			</div>
		</div>
	{/if}
</BaseModal>

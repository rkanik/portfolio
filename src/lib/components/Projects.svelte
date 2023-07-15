<script lang="ts">
	import type { TProject, TTechnology } from '$lib/types'
	import type { TPaginated } from '$lib/utils/toPaginated'

	import Icon from '@iconify/svelte'
	import ProjectCard from './ProjectCard.svelte'
	import BaseModal from './base/BaseModal.svelte'
	import BaseSection from './base/BaseSection.svelte'
	import ProjectDetails from './project/ProjectDetails.svelte'

	export let projects: TPaginated<TProject>
	export let technologies: (TTechnology & { active?: boolean })[] = []
	export let max: number = projects.data.length

	$: currentTechnologyIds = technologies
		.filter((technology) => technology.active)
		.map((technology) => technology.id)

	$: copiedProjects = [...projects.data]
	$: filteredProjects = currentTechnologyIds.length
		? copiedProjects.filter((project) => {
				return project.projectTechnologies.some((tech) => {
					return currentTechnologyIds.includes(tech.technologies.id)
				})
		  })
		: copiedProjects

	let currentProject: TProject = null!
</script>

<BaseSection
	class="pb-20"
	subheader="Projects"
	title="Here is some of my Projects"
	description="Welcome to my Portfolio Projects Showcase, where I highlight my most recent and impressive projects. Each project comes with a brief description and a link to the live demo or GitHub repository. I have worked on these projects individually or as part of a team. Whether you are a potential employer, a client, or a fellow developer, I hope these will give you a sense of my capabilities and the kind of work I am passionate about. Feel free to explore and get in touch if you have any questions or would like to discuss potential collaboration opportunities."
>
	<div class="mt-8 max-w-4xl mx-auto">
		<div class="flex flex-wrap justify-center -mt-2 -ml-2">
			{#if Array.isArray(technologies)}
				{#each technologies as item}
					<button
						class="mt-2 ml-2 space-x-2 text-xs font-normal rounded-full btn btn-sm"
						class:btn-primary={item.active}
						class:btn-outline={!item.active}
						on:click={() => (item.active = !item.active)}
					>
						<div class="w-4 h-4">
							<Icon icon={item.icon} class="text-base" />
						</div>
						<span>{item.name}</span>
					</button>
				{/each}
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 gap-8 mt-8 md:grid-cols-4">
		{#each filteredProjects.slice(0, max) as project}
			<ProjectCard {project} on:click={(e) => (currentProject = e.detail)} />
		{/each}
	</div>
	{#if projects.data.length > max}
		<div class="mt-8 text-center">
			<a href="/projects" class="space-x-2 rounded-full btn btn-outline btn-primary">
				<span>Show more</span>
				<Icon class="text-lg" icon="material-symbols:keyboard-double-arrow-right-rounded" />
			</a>
		</div>
	{/if}
</BaseSection>

<BaseModal value={!!currentProject} activator={false} hideClose modalBox="max-w-[100%]" let:close>
	{#if currentProject}
		<ProjectDetails project={currentProject} on:close={close} />
	{/if}
</BaseModal>

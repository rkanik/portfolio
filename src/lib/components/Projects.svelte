<script lang="ts">
	import type { TProject, TTechnology } from '$lib/types'
	import type { TPaginated } from '$lib/utils/toPaginated'
	import BaseModal from './base/BaseModal.svelte'
	import BaseSection from './base/BaseSection.svelte'
	import ProjectDetails from './project/ProjectDetails.svelte'
	import ProjectCard from './ProjectCard.svelte'
	import Icon from '@iconify/svelte'
	import { arrayUniqueBy } from '$lib/utils/arrayUniqueBy'

	export let projects: TPaginated<TProject>
	export let technologies: (TTechnology & { active?: boolean })[] = []
	export let max: number = projects.data.length

	$: technologies = arrayUniqueBy(
		projects.data.reduce<TTechnology[]>(
			(carry, project) =>
				carry.concat(
					project.projectTechnologies.map((v) => {
						return v.technology
					}),
				),
			[],
		),
		'id',
	)

	$: currentTechnologyIds = technologies
		.filter((technology) => technology.active)
		.map((technology) => technology.id)

	$: copiedProjects = [...projects.data]
	$: filteredProjects = currentTechnologyIds.length
		? copiedProjects.filter((project) => {
				return project.projectTechnologies.some((tech) => {
					return currentTechnologyIds.includes(tech.technology.id)
				})
			})
		: copiedProjects

	let order = 'ranking'
	$: orderedProjects =
		order === 'newest'
			? [...filteredProjects].sort((a, b) => {
					if (!a.createdAt || !b.createdAt) return 0
					return (
						(new Date(b.createdAt) as any) -
						(new Date(a.createdAt) as any)
					)
				})
			: filteredProjects

	let currentProject: TProject = null!
</script>

<BaseSection
	class="pb-20"
	subheader="Projects"
	title="Here is some of my Projects"
	description="Welcome to my Portfolio Projects Showcase, where I highlight my most recent and impressive projects. Each project comes with a brief description and a link to the live demo or GitHub repository. I have worked on these projects individually or as part of a team. Whether you are a potential employer, a client, or a fellow developer, I hope these will give you a sense of my capabilities and the kind of work I am passionate about. Feel free to explore and get in touch if you have any questions or would like to discuss potential collaboration opportunities."
>
	<div class="mx-auto mt-8 max-w-4xl">
		<div class="-ml-2 -mt-2 flex flex-wrap justify-center">
			{#if Array.isArray(technologies)}
				{#each technologies as item}
					<button
						class="btn btn-sm ml-2 mt-2 space-x-2 rounded-full text-xs font-normal"
						class:btn-primary={item.active}
						class:btn-outline={!item.active}
						on:click={() => (item.active = !item.active)}
					>
						<div class="h-4 w-4">
							<Icon icon={item.icon} class="text-base" />
						</div>
						<span>{item.name}</span>
					</button>
				{/each}
			{/if}
		</div>
	</div>
	<select bind:value={order}>
		<option value="ranking">Ranking</option>
		<option value="newest">Newest</option>
	</select>
	<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
		{#each orderedProjects.slice(0, max) as project}
			<ProjectCard {project} on:click={(e) => (currentProject = e.detail)} />
		{/each}
	</div>
	{#if projects.data.length > max}
		<div class="mt-8 text-center">
			<a
				href="/projects"
				class="btn btn-outline btn-primary space-x-2 rounded-full"
			>
				<span>Show more</span>
				<Icon
					class="text-lg"
					icon="material-symbols:keyboard-double-arrow-right-rounded"
				/>
			</a>
		</div>
	{/if}
</BaseSection>

<BaseModal
	value={!!currentProject}
	activator={false}
	hideClose
	modalBox="max-w-[100%]"
	let:close
>
	{#if currentProject}
		<ProjectDetails project={currentProject} on:close={close} />
	{/if}
</BaseModal>

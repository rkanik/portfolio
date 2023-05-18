<script lang="ts">
	import Icon from '@iconify/svelte'
	import ProjectCard from '$lib/components/ProjectCard.svelte'
	import ProjectDetails from '$lib/components/project/ProjectDetails.svelte'

	import type { TProject, TUserTechnology } from '$lib/types'

	export let data

	let max = 4
	let project: TProject = null!
	let projects: TProject[] = []
	let userTechnologies: TUserTechnology[] = []

	$: {
		project = data.project
		projects = data.projects
		userTechnologies = data.userTechnologies
	}
</script>

<div class="container mx-auto min-h-screen pt-5">
	<ProjectDetails {project} {userTechnologies} />
	<div class="grid grid-cols-1 gap-8 mt-8 md:grid-cols-4">
		{#each projects.slice(0, max) as project}
			<ProjectCard {project} />
		{/each}
	</div>
	{#if projects.length > max}
		<div class="mt-8 text-center">
			<a href="/projects" class="space-x-2 rounded-full btn btn-outline btn-primary">
				<span>Show more</span>
				<Icon class="text-lg" icon="material-symbols:keyboard-double-arrow-right-rounded" />
			</a>
		</div>
	{/if}
</div>

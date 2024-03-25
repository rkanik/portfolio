<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte'
	import ProjectDetails from '$lib/components/project/ProjectDetails.svelte'

	export let data

	$: project = data.project
	$: projects = (data.projects?.data?.data || []).filter((item) => {
		return item.id !== project.id
	})

	$: similarProjects = projects
		.map((item) => ({
			project: item,
			indexes: item.projectTechnologies
				.map((itemTech) =>
					project.projectTechnologies.findIndex((projectTech) => {
						return projectTech.technologies.id === itemTech.technologies.id
					})
				)
				.filter((index) => index !== -1)
		}))
		.filter((item) => item.indexes.length)
		.sort((item1, item2) => item2.indexes.length - item1.indexes.length)
		.map((item) => item.project)

	$: otherProjects = projects.filter((item) => {
		return !similarProjects.some((project) => {
			return project.id === item.id
		})
	})

	$: console.log(data)
</script>

<div class="container px-5 mx-auto min-h-screen pt-5">
	<ProjectDetails {project} hideClose />

	<h4 class=" text-xl font-medium mt-8">Similar Projects</h4>
	<div
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-6 lg:gap-7 xl:gap-8 mt-4"
	>
		{#each similarProjects as project}
			<ProjectCard {project} />
		{/each}
	</div>

	<h4 class="mt-4 text-xl font-medium">Other Projects</h4>
	<div
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-6 lg:gap-7 xl:gap-8 mt-4"
	>
		{#each otherProjects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</div>

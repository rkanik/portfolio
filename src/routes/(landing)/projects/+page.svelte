<script lang="ts">
	import type { TTechnology } from '$lib/types'

	import Projects from '$lib/components/Projects.svelte'
	import { arrayUniqueBy } from '$lib/utils/arrayUniqueBy'

	export let data

	$: technologies = arrayUniqueBy(
		data.projects.data.data.reduce<TTechnology[]>(
			(carry, project) =>
				carry.concat(
					project.projectTechnologies.map((v) => {
						return v.technologies
					})
				),
			[]
		),
		'id'
	)
</script>

<svelte:head>
	<title>Projects | Rasel Khandkar</title>
</svelte:head>

<Projects {technologies} projects={data.projects.data} />

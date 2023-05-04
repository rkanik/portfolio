<script lang="ts">
	import Projects from '$lib/components/Projects.svelte'
	export let data
</script>

<svelte:head>
	<title>Projects | RK Anik</title>
</svelte:head>

<Projects projects={data.projects} userTechnologies={data.userTechnologies} />

<script>
	import EducationSection from '$lib/components/education/EducationSection.svelte'
	import ExperienceSection from '$lib/components/experience/ExperienceSection.svelte'

	export let data
</script>

<svelte:head>
	<title>Experiences & Educations | Rasel Khandkar</title>
</svelte:head>

<ExperienceSection class="pt-20" experiences={data.publicUser.profile?.experiences || []} />
<EducationSection educations={data.publicUser.profile?.educations || []} />

<script lang="ts">
	import type { TExperience } from '$lib/types'
	import TimelineItem from '../TimelineItem.svelte'

	export let experiences: TExperience[]
</script>

{#each experiences as experience}
	<TimelineItem item={experience} right={experience.right} />
{/each}

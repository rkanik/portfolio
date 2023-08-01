<script lang="ts">
	import type { TEducation } from '$lib/types/Profile'
	import TimelineItem from '../TimelineItem.svelte'

	export let educations: TEducation[]
</script>

{#each educations as education}
	<TimelineItem item={education} right={education.right} />
{/each}

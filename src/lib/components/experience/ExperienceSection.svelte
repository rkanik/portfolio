<script lang="ts">
	import type { TExperience } from '$lib/types'
	import BaseSection from '../base/BaseSection.svelte'
	import ExperienceTimeline from './ExperienceTimeline.svelte'

	export let experiences: TExperience[]
</script>

<BaseSection class={$$props.class} subheader="Experience" title="Professional Experiences">
	<div class="pt-8 pb-8 pl-7 lg:pl-0">
		<ExperienceTimeline {experiences} />
	</div>
</BaseSection>

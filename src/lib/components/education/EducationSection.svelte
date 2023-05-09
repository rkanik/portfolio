<script lang="ts">
	import type { TEducation } from '$lib/types'
	import BaseSection from '../base/BaseSection.svelte'
	import EducationTimeline from './EducationTimeline.svelte'

	export let educations: TEducation[]
</script>

<BaseSection class={$$props.class} subheader="Education" title="Educational Qualifications">
	<div class="pt-8 pb-16">
		<EducationTimeline {educations} />
	</div>
</BaseSection>

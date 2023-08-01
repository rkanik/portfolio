<script lang="ts">
	import type { TEducation } from '$lib/types/Profile'
	import BaseSection from '../base/BaseSection.svelte'
	import EducationTimeline from './EducationTimeline.svelte'

	export let educations: TEducation[]
</script>

<BaseSection class={$$props.class} subheader="Education" title="Educational Qualifications">
	<div class="pt-8 pb-16 pl-7 lg:pl-0">
		<EducationTimeline {educations} />
	</div>
</BaseSection>

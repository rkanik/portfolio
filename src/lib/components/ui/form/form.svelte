<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let action
	export let enhance: any
</script>

<form {action} method="post" use:enhance {...$$restProps}>
	<slot />
</form>

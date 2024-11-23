<script lang="ts">
	import cn from '$lib/utils/cn'
	import MenuItem from './MenuItem.svelte'
	import type { TMenuItem } from './types'

	export let menu = true
	export let items: TMenuItem[]
</script>

<ul class={cn($$props.class, { menu })}>
	{#each items as item}
		<MenuItem {item} />
	{/each}
</ul>

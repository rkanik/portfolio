<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import Icon from '@iconify/svelte'

	export let title: string
	export let hidePlus = false

	const dispatch = createEventDispatcher()
</script>

<div class="group/p relative collapse border border-base-100 rounded overflow-hidden">
	<input type="checkbox" class="peer min-h-0" />
	<div
		class="collapse-title p-0 min-h-0 peer-checked:bg-base-100 px-2 py-2 font-medium text-sm relative flex items-center justify-between pr-8"
	>
		{title}
	</div>

	<div
		class="absolute right-2 z-10 top-2 transform peer-checked:rotate-90 transition pointer-events-none"
	>
		<Icon class="text-xl" icon="mdi:chevron-right" />
	</div>

	{#if !hidePlus}
		<button
			on:click|preventDefault|stopPropagation={(e) => dispatch('plus', e)}
			class="opacity-0 invisible group-hover/p:opacity-100 group-hover/p:visible transition absolute right-8 z-10 top-1.5 hidden peer-checked:flex hover:bg-base-300 rounded-full h-6 w-6  items-center justify-center"
		>
			<Icon class="text-lg" icon="mdi:plus" />
		</button>
	{/if}

	<div class="collapse-content !p-0">
		<slot />
	</div>
</div>

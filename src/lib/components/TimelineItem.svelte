<script lang="ts">
	import cn from '$lib/utils/cn'

	export let item: any = null
	export let right: boolean = false
</script>

<div
	class={cn('max-w-[50%] border-primary transform py-8 relative ', {
		'border-r-8 translate-x-1': !right,
		'ml-auto border-l-8 -translate-x-1': right
	})}
>
	<div
		class={cn(
			'absolute flex items-center justify-center w-12 h-12 text-[11px] font-black transform -translate-y-1/2 bg-white border-[7px] rounded-full text-base-300 border-primary top-1/2',
			{
				'-right-7': !right,
				'-left-7': right
			}
		)}
	>
		{item.year}
	</div>
	<div
		class={cn('bg-base-100 w-max px-4 py-4 lg:px-8 border border-white border-opacity-10', {
			'mr-12 text-right ml-auto rounded-xl': !right,
			'ml-12 rounded-xl': right
		})}
	>
		<h4 class="text-xl">{item.title}</h4>
		{#each item.lines as line}
			<div class="opacity-70">{@html line}</div>
		{/each}
	</div>
</div>

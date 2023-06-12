<script lang="ts">
	import cn from '$lib/utils/cn'

	export let item: any = null
	export let right: boolean = false
</script>

<div
	class={cn('lg:max-w-[50%] border-primary transform py-8 relative', {
		'lg:border-r-8 border-l-8 lg:border-l-0 -translate-x-1 lg:translate-x-1': !right,
		'lg:ml-auto border-l-8 -translate-x-1': right
	})}
>
	<div
		class={cn(
			'absolute flex items-center justify-center w-12 h-12 text-[11px] font-black transform -translate-y-1/2 bg-white border-[7px] rounded-full text-base-300 border-primary top-1/2',
			{
				'-left-7 lg:left-auto lg:-right-7': !right,
				'-left-7': right
			}
		)}
	>
		{item.year}
	</div>
	<div
		class={cn(
			'bg-base-100 lg:w-max overflow-hidden px-4 py-4 lg:px-8 border border-white border-opacity-10',
			{
				'ml-12 lh lg:mr-12 lg:text-right lg:ml-auto rounded-xl': !right,
				'ml-12 rounded-xl': right
			}
		)}
	>
		<h4 class="text-xl">{item.title}</h4>
		{#each item.lines as line}
			<div class="opacity-70">{@html line}</div>
		{/each}
	</div>
</div>

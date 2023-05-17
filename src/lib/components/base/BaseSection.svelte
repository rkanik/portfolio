<script lang="ts">
	import cn from '$lib/utils/cn'

	export let id: string | undefined = undefined
	export let subheader: string
	export let title: string
	export let description: string | undefined = undefined
</script>

<section
	{id}
	class={cn(
		'container flex flex-col justify-center min-h-screen mx-auto px-5 md:px-0',
		$$props.class
	)}
>
	<div class="w-full max-w-4xl mx-auto mt-16">
		<div
			class="text-xs md:text-sm font-medium tracking-widest text-center uppercase text-secondary"
		>
			{subheader}
		</div>
		<h1 class="mt-2 md:mt-4 mb-4 md:mb-8 text-3xl md:text-5xl font-bold text-center">{title}</h1>
		{#if description}
			<p class="m-0 text-base text-center">{description}</p>
		{/if}
	</div>
	<div class="flex-1 w-full mt-4">
		<slot />
	</div>
</section>

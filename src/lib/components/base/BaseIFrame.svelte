<script lang="ts">
	import cn from '$lib/utils/cn'
	import { onMount } from 'svelte'

	export let title = ''
	export let src: string
	export let iframeClass = 'rounded-2xl'

	export let width = 1366
	export let height = 768

	export let initialScale = 1
	export let iframe: HTMLIFrameElement

	let scale = 1
	let scaledHeight = height * initialScale

	let container: HTMLElement

	let isLoading = true

	const onLoad = () => {
		isLoading = false
	}

	$: if (src) {
		isLoading = true
	}

	onMount(() => {
		const { width: containerWidth } = container.getBoundingClientRect()
		scale = containerWidth / width
		scaledHeight = height * scale
		iframe.classList.remove('w-full')
	})
</script>

<div
	bind:this={container}
	style={`--scale: ${scale};height: ${scaledHeight}px`}
	class={cn('base-iframe overflow-hidden relative rounded-2xl w-full', $$props.class)}
>
	<iframe
		{src}
		{title}
		{width}
		{height}
		bind:this={iframe}
		frameborder="0"
		on:load={onLoad}
		class={cn('w-full', iframeClass || 'rounded-2xl')}
	/>
	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
			<progress class="progress progress-primary w-32" />
		</div>
	{/if}
</div>

<style lang="scss">
	.base-iframe {
		iframe {
			border: 0;

			-ms-transform: scale(var(--scale));
			-moz-transform: scale(var(--scale));
			-o-transform: scale(var(--scale));
			-webkit-transform: scale(var(--scale));
			transform: scale(var(--scale));

			-ms-transform-origin: 0 0;
			-moz-transform-origin: 0 0;
			-o-transform-origin: 0 0;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
		}
	}
</style>

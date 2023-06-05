<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	export let src = ''
	export let lazySrc = src
	export let alt = src || lazySrc

	export let errorSrc = '/img/fallback-image.webp'

	let isMounted = false
	let imgRef: HTMLImageElement
	let observer: IntersectionObserver

	const onError = () => (imgRef.src = errorSrc)

	const observe = (src: string) => {
		if (imgRef && src && isMounted) {
			observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && imgRef.src !== src) {
						entry.target.setAttribute('src', src)
						unobserve()
					}
				})
			})
			observer.observe(imgRef)
		}
	}

	const unobserve = () => {
		observer?.unobserve(imgRef)
	}

	$: {
		observe(lazySrc)
	}

	onMount(() => {
		isMounted = true
		observe(lazySrc)
	})

	onDestroy(unobserve)
</script>

<img
	{alt}
	{src}
	bind:this={imgRef}
	on:error={onError}
	class={$$props.class || 'object-contain content-center w-full'}
/>

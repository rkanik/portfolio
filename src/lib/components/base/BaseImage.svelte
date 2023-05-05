<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	export let src: string | null | undefined = ''
	export let lazySrc: string | null | undefined = src
	export let alt = src || lazySrc

	export let errorSrc = '/img/placeholder.svg'

	let isMounted = false
	let imgRef: HTMLImageElement
	let obserber: IntersectionObserver

	const onError = () => (imgRef.src = errorSrc)

	// $: if (src && isMounted) {
	// 	// console.log({ srcChange: src })
	// 	obserber.observe(imgRef)
	// }

	onMount(() => {
		isMounted = true
		obserber = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (lazySrc && (entry.target as HTMLImageElement).src !== lazySrc) {
						entry.target.setAttribute('src', lazySrc)
						obserber.unobserve(imgRef)
					}
				}
			})
		})
		obserber.observe(imgRef)
	})

	onDestroy(() => {
		obserber?.unobserve(imgRef)
	})

	let clazz = 'object-contain content-center w-full'
	export { clazz as class }
</script>

<img {alt} {src} bind:this={imgRef} on:error={onError} class={clazz} />

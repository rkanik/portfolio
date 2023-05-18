<script lang="ts">
	import Icon from '@iconify/svelte'
	import { onDestroy, onMount } from 'svelte'

	let visible = false

	const onScroll = () => {
		let v = window.scrollY > 80
		if (v !== visible) visible = v
	}

	const onScrollToTop = () => {
		window.scroll({
			top: 0,
			behavior: 'smooth'
		})
	}

	onMount(() => {
		window.addEventListener('scroll', onScroll)
	})

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', onScroll)
		}
	})
</script>

<button
	class="btn btn-circle btn-primary fixed bottom-4 right-4 z-50 shadow transition-all duration-500 transform {visible
		? 'opacity-100 scale-100 visible'
		: 'opacity-0 scale-0 invisible'}"
	on:click={onScrollToTop}
>
	<Icon icon="material-symbols:keyboard-arrow-up-rounded" class="text-2xl" />
</button>

import { onMount } from 'svelte'

const useStyleOnScroll = (el: HTMLDivElement) => {
	let oldScrollY = 0
	onMount(() => {
		el.style.top = '0px'
		oldScrollY = window.scrollY

		window.onscroll = () => {
			const top = oldScrollY > window.scrollY ? '0px' : '-128px'
			const classes = window.scrollY < 80 ? 'bg-transparent' : 'bg-base-200'

			if (el.style.top !== top) el.style.top = top

			oldScrollY = window.scrollY
		}
	})
}

export default useStyleOnScroll

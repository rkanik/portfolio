import debounce from '$lib/utils/debounce'
import { onDestroy, onMount } from 'svelte'
import { writable } from 'svelte/store'

type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

type Breakpoint = {
	name: BreakpointName

	xs: boolean
	sm: boolean
	md: boolean
	lg: boolean
	xl: boolean
	'2xl': boolean
	// DOWN
	smAndDown: boolean
	mdAndDown: boolean
	lgAndDown: boolean
	xlAndDown: boolean
	// UP
	smAndUp: boolean
	mdAndUp: boolean
	lgAndUp: boolean
	xlAndUp: boolean
}

const calculateBreakpoint = (width: number) => {
	const breakpoints = {
		name: 'xs',
		// EXACT
		xs: eval(`${width} > 0 && ${width} < 640`),
		sm: eval(`${width} >= 640 && ${width} < 768`),
		md: eval(`${width} >= 768 && ${width} < 1024`),
		lg: eval(`${width} >= 1024 && ${width} < 1280`),
		xl: eval(`${width} >= 1280 && ${width} < 1536`),
		'2xl': eval(`${width} >= 1536`),
		// DOWN
		smAndDown: eval(`${width} > 0 && ${width} < 768`),
		mdAndDown: eval(`${width} > 0 && ${width} < 1024`),
		lgAndDown: eval(`${width} > 0 && ${width} < 1280`),
		xlAndDown: eval(`${width} > 0 && ${width} < 1536`),
		// UP
		smAndUp: eval(`${width} >= 640`),
		mdAndUp: eval(`${width} >= 768`),
		lgAndUp: eval(`${width} >= 1024`),
		xlAndUp: eval(`${width} >= 1536`)
	} as Breakpoint

	breakpoints.name = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].find((name) => {
		return breakpoints[name as BreakpointName] === true
	}) as BreakpointName

	return breakpoints
}

const count = writable(0)
const breakpoints = writable(calculateBreakpoint(0))

const setVH = () => {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}

const onResize = debounce<UIEvent>(() => {
	// Calculate new breakpoints
	const newBreakpoints = calculateBreakpoint(window.innerWidth)

	// Set new breakpoints only if they are different from the current ones
	breakpoints.subscribe((v) => {
		if (JSON.stringify(v) !== JSON.stringify(newBreakpoints)) {
			breakpoints.set(newBreakpoints)
		}
	})()

	// Update viewport height
	setVH()
}, 500)

const useBreakpoints = () => {
	onMount(() => {
		count.update((v) => {
			if (v === 0) {
				setVH()
				breakpoints.set(calculateBreakpoint(window.innerWidth))

				window.addEventListener('resize', onResize)
			}
			return v + 1
		})
	})

	onDestroy(() => {
		count.update((v) => {
			if (v === 1) {
				window.removeEventListener('resize', onResize)
			}
			return v - 1
		})
	})

	return breakpoints
}

export default useBreakpoints

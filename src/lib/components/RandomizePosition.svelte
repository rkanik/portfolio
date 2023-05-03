<script lang="ts">
	import cn from '$lib/utils/cn'
	import { onMount } from 'svelte'

	type Element = {
		x: number
		y: number
		radius: number
		width: string
		height: string
		left: string
		top: string
		bottom: string
		item?: any
	}

	export let minRadius = 50
	export let maxRadius = 50
	export let minDistance = 2 * maxRadius
	export let maxAttempt = 20

	let elements: Element[] = []
	let container: HTMLDivElement

	const generateElement = (item: any, attempt = 0) => {
		if (attempt > maxAttempt) {
			return
		}

		const radius = Math.floor(Math.random() * (maxRadius - minRadius + 1) + minRadius)
		const x = Math.floor(Math.random() * (container.clientWidth - 2 * radius)) + radius
		const y = Math.floor(Math.random() * (container.clientHeight - 2 * radius)) + radius

		const circle = {
			item,
			x,
			y,
			radius,
			width: 2 * radius + 'px',
			height: 2 * radius + 'px',
			left: x - radius + 'px',
			top: y - radius + 'px',
			bottom: 'auto'
		}

		if (
			!elements.some((element) => {
				return element.item.id !== item.id && isOverlap(element, circle)
			})
		) {
			elements = elements.map((el) => {
				return el.item.id === item.id ? circle : el
			})
			// elements = [...elements, circle]
			return
		}

		generateElement(item, attempt + 1)
	}

	const isOverlap = (c1: Element, c2: Element) => {
		const dx = c1.x - c2.x
		const dy = c1.y - c2.y
		const distance = Math.sqrt(dx * dx + dy * dy)
		return distance < minDistance
	}

	export let items: any[] = []

	const randomize = () => {
		items.forEach((item, index) => {
			setTimeout(() => {
				generateElement(item)
			}, (index + 1) * 20)
		})
	}

	onMount(() => {
		elements = items.map((item) => {
			const radius = Math.floor(Math.random() * (maxRadius - minRadius + 1) + minRadius)
			return {
				item,
				x: -1,
				y: -1,
				radius,
				top: '50%',
				left: '50%',
				bottom: '0',
				width: 2 * radius + 'px',
				height: 2 * radius + 'px'
			}
		})

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						randomize()
						observer.unobserve(container)
					}
				})
			},
			{ threshold: 0.35 }
		)

		observer.observe(container)
	})
</script>

<div bind:this={container} class="relative min-h-[600px]">
	{#each elements as element}
		<div
			class={cn(
				'absolute transition-all duration-1000 ease-out transform -translate-x-1/2 -translate-y-1/2'
			)}
			style="
				width:{element.width};
				height:{element.height};
				top: {element.top};
				left: {element.left};
				opacity:{element.top === '50%' ? '0' : '1'}
			"
		>
			<slot name="item" item={element.item} />
		</div>
	{/each}
	<button on:click={randomize} class="relative z-10">randomize</button>
</div>

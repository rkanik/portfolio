<script lang="ts">
	import { onMount } from 'svelte'

	type Element = {
		x: number
		y: number
		radius: number
		width: string
		height: string
		left: string
		top: string
		item?: any
	}

	export let minRadius = 50
	export let maxRadius = 50
	export let minDistance = 2 * maxRadius
	export let maxAttempt = 20

	let elements: Element[] = []
	let container: HTMLDivElement

	const generateElement = (item: any, attempt = 0) => {
		console.log('generateElement', item.id, attempt)
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
			top: y - radius + 'px'
		}

		if (!elements.some((c) => isOverlap(c, circle))) {
			elements = [...elements, circle]
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

	onMount(() => {
		items.forEach((item) => {
			generateElement(item)
		})
	})
</script>

<div bind:this={container} class="relative min-h-[600px]">
	{#each elements as element}
		<div
			class="absolute"
			style="width:{element.width};height:{element.height};top:{element.top};left:{element.left}"
		>
			<slot name="item" item={element.item} />
		</div>
	{/each}
</div>

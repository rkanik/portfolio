<script lang="ts">
	import cn from '$lib/utils/cn'
	const resize = (handle: HTMLDivElement) => {
		const box = handle.parentElement as HTMLDivElement

		const currentRect = {
			x: 0,
			width: 0
		}

		const onMouseUp = () => {
			window.removeEventListener('mouseup', onMouseUp)
			window.removeEventListener('mousemove', onMouseMove)
		}

		const onMouseMove = (event: MouseEvent) => {
			const delta = event.pageX - currentRect.x
			box.style.width = `${currentRect.width + delta}px`
		}

		const onMouseDown = (event: MouseEvent) => {
			const rect = box.getBoundingClientRect()

			currentRect.x = event.pageX
			currentRect.width = rect.width

			window.addEventListener('mouseup', onMouseUp)
			window.addEventListener('mousemove', onMouseMove)
		}

		handle.addEventListener('mousedown', onMouseDown)
	}
</script>

<div {...$$restProps} class={cn('relative', $$props.class)}>
	<div use:resize class="absolute inset-y-0 w-2 -right-1 cursor-col-resize" />
	<slot />
</div>

<style>
</style>

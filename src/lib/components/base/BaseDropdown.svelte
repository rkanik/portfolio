<script lang="ts">
	import { tick } from 'svelte'

	function mouseX(evt: any) {
		if (evt.pageX) {
			return evt.pageX
		}
		if (evt.clientX) {
			return (
				evt.clientX +
				(document.documentElement.scrollLeft
					? document.documentElement.scrollLeft
					: document.body.scrollLeft)
			)
		}
		return null
	}

	function mouseY(evt: any) {
		if (evt.pageY) {
			return evt.pageY
		}
		if (evt.clientY) {
			return (
				evt.clientY +
				(document.documentElement.scrollTop
					? document.documentElement.scrollTop
					: document.body.scrollTop)
			)
		}
		return null
	}

	let contentElement: HTMLElement
	let style = { posX: 0, posY: 0, visible: false }

	const onClickActivator = async (event: any) => {
		event.preventDefault()
		style = {
			...style,
			visible: true,
			posX: mouseX(event),
			posY: mouseY(event)
		}
		tick().then(() => {
			const offsetWidth = contentElement.offsetWidth || 0
			const offsetHeight = contentElement.offsetHeight || 0
			if (style.posX + offsetWidth > window.innerWidth) {
				style = {
					...style,
					posX: style.posX - offsetWidth
				}
			}
			if (style.posY + offsetHeight > window.innerHeight) {
				style = {
					...style,
					posY: style.posY - offsetHeight
				}
			}
		})
	}
</script>

<div {...$$restProps} class="dropdown dropdown-end {$$props.class || ''}">
	<slot name="activator" onClick={onClickActivator}>
		<button class="btn m-1" on:click={onClickActivator}>Click</button>
	</slot>
	<div
		bind:this={contentElement}
		class="dropdown-content shadow bg-base-100 rounded-box w-52 !fixed"
		style={`top:${style.posY}px;left:${style.posX}px;display:${style.visible ? 'block' : 'none'}`}
	>
		<slot />
	</div>
</div>

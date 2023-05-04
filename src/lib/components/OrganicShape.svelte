<script lang="ts">
	import { onMount } from 'svelte'

	import cn from '$lib/utils/cn'
	import Organic from '$lib/organic.min'

	let clazz = ''
	let el: HTMLDivElement

	const animate = (organ: Organic, isActive: boolean, after: number) => {
		return new Promise<boolean>((resolve) => {
			setTimeout(() => {
				organ.isActive = isActive
				organ.animate()
				resolve(true)
			}, after)
		})
	}

	const initialize = async () => {
		let organ = new Organic(el)
		await animate(organ, true, 3000)
		await animate(organ, false, 5000)
	}

	onMount(() => {
		initialize()
	})

	export { clazz as class }
</script>

<div
	bind:this={el}
	class={cn('item', clazz)}
	data-animation-path-duration="1500"
	data-animation-path-easing="easeOutElastic"
	data-morph-path="M 418.1,159.8 C 460.9,222.9 497,321.5 452.4,383.4 417.2,432.4 371.2,405.6 271.3,420.3 137.2,440 90.45,500.6 42.16,442.8 -9.572,381 86.33,289.1 117.7,215.5 144.3,153.4 145.7,54.21 212.7,36.25 290.3,15.36 373.9,94.6 418.1,159.8 Z"
	data-path-scaleY="1.1"
	data-image-scaleX="1.3"
	data-image-scaleY="1.3"
	data-animation-deco-duration="2000"
	data-animation-deco-delay="100"
	data-deco-rotate="-10"
>
	<svg class="item__svg" width="500px" height="500px" viewBox="0 0 500 500">
		<clipPath id="clipShape2">
			<path
				class="item__clippath"
				d="M 378.1,121.2 C 408.4,150 417.2,197.9 411,245.8 404.8,293.7 383.5,341.7 353.4,370.7 303.2,419.1 198.7,427.7 144.5,383.8 86.18,336.5 67.13,221.3 111.9,161 138.6,125 188.9,99.62 240.7,90.92 292.4,82.24 345.6,90.32 378.1,121.2 Z"
			/>
		</clipPath>
		<g class="item__deco">
			<path
				d="M 119.8,69.41 C 213.5,18.01 367.2,-1.306 440.4,76.58 482.9,121.9 435.3,200.8 432.9,262.9 431.1,310.6 461.3,372.1 427.7,406 342.4,492 158.3,499.3 64.62,422.5 10.09,377.8 18.76,282.6 32.51,213.5 43.46,158.4 70.61,96.36 119.8,69.41 Z"
			/>
		</g>
		<g clip-path="url(#clipShape2)">
			<image
				class="item__img"
				xlink:href="/img/hero-organic.png"
				x="0"
				y="0"
				height="500px"
				width="500px"
			/>
		</g>
	</svg>
</div>

<style lang="scss">
	/* items */
	.item {
		//position: relative;
		width: 500px;
		max-width: 100%;
		margin: 0 0 0 auto;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		grid-column: span 2;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}
	.item:nth-of-type(even) {
		margin: 0 auto 0 0;
	}
	.item:first-of-type {
		grid-column: span 1;
	}
	.item__svg {
		position: relative;
		display: block;
		width: 80%;
		height: auto;
		min-height: 500px;
		margin: 0 auto;
	}
	.item__clippath,
	.item__deco,
	.item__img {
		transform-origin: 50% 50%;
	}
	.item__meta {
		position: absolute;
		top: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.item__number {
		position: absolute;
		top: 0;
		width: 100%;
		padding: 12.5% 0 0 3em;
		letter-spacing: 0.5em;
		text-transform: uppercase;
	}
	.item__specimen {
		font-size: 5em;
		font-weight: 500;
		line-height: 0.9;
		vertical-align: text-bottom;
		letter-spacing: -0.025em;
	}
	.item__reference {
		font-size: 1.25em;
		-webkit-writing-mode: vertical-rl;
		writing-mode: vertical-rl;
	}
	.item__title {
		font-size: 1.165em;
		font-weight: 600;
		width: 100%;
		margin: 1em 0 0 0;
		text-align: center;
		letter-spacing: 0.125em;
		color: #fff;
	}
	.item__subtitle {
		font-size: 1em;
		font-weight: 500;
		margin: 0.5em 0 0;
		text-align: center;
		letter-spacing: 0.15em;
		opacity: 0;
	}
	.item__deco {
		fill: #404040;
	}
	@media screen and (max-width: 60em) {
		.item:first-of-type {
			grid-column: span 2;
		}
		.content--grid {
			grid-row-gap: 25vh;
		}
	}
	@media screen and (max-width: 40em) {
		.codrops-header__title {
			font-size: 1em;
		}
		.content--grid {
			padding: 2vh 8vw;
		}
		.item__number {
			font-size: 0.75em;
		}
		.item__svg {
			min-height: 360px;
		}
	}
</style>

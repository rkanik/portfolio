<script lang="ts">
	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	import * as pdfjsLib from 'pdfjs-dist'

	import { onMount } from 'svelte'

	pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
		'pdfjs-dist/build/pdf.worker.js',
		import.meta.url
	).toString()

	export let src: string

	let pdfDoc: any = null,
		numPages = 0

	let el: HTMLDivElement

	export let pageNumber = 1

	type TPage = {
		scale?: number
		number: number
		canvas: HTMLCanvasElement
	}

	let viewport: any

	function renderPage(event: TPage) {
		// Using promise to fetch the page
		pdfDoc.getPage(event.number).then(async (page: any) => {
			let initialViewport = page.getViewport({ scale: 1 })

			let innerScale = scale || 1
			let innerViewport = page.getViewport({ scale: innerScale })

			if (!viewport || viewport.scale !== innerScale) {
				viewport = innerViewport
			}

			const isMini = event.canvas.getAttribute('data-mini') === 'true'
			if (isMini) {
				innerScale =
					(+(event.canvas.getAttribute('data-width') || 0) || event.canvas.clientWidth) /
					initialViewport.width
				innerViewport = page.getViewport({ scale: innerScale })
			}

			event.canvas.width = innerViewport.width
			event.canvas.height = innerViewport.height

			const renderTask = page.render({
				viewport: innerViewport,
				canvasContext: event.canvas.getContext('2d')
			})

			event.canvas.removeAttribute('style')
			event.canvas.setAttribute('data-rendered', 'true')

			await renderTask.promise
		})
	}

	let intersectionRatios: number[] = []

	const renderer = (canvas: HTMLCanvasElement) => {
		const observer = new IntersectionObserver(
			(entries) => {
				const index = +(canvas.getAttribute('data-page') || 1) - 1
				if (entries.some((entry) => entry.isIntersecting)) {
					// Render the page
					if (canvas.getAttribute('data-rendered') !== 'true') {
						renderPage({
							canvas,
							number: +(canvas.getAttribute('data-page') || 1)
						})
					}
					// unobserve the mini page
					if (canvas.getAttribute('data-mini') === 'true') {
						observer.unobserve(canvas)
					}
					// Save the intersectionRatio
					else {
						intersectionRatios[index] = entries[0].intersectionRatio
					}
				}
				//
				else {
					intersectionRatios[index] = 0
				}
			},
			{
				threshold: [0, 0.5, 1]
			}
		)
		observer.observe(canvas)
	}

	// Page Number
	let pagesElement: HTMLDivElement
	let miniPagesElement: HTMLDivElement
	let isScrollingPagesElement = false

	const scrollToPage = (page: number) => {
		const canvas = pagesElement.querySelector(`.page[data-page="${page}"]`) as HTMLCanvasElement
		pageNumber = page

		let timeout: NodeJS.Timeout
		const onScroll = () => {
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				isScrollingPagesElement = false
				pagesElement.addEventListener('scroll', onScroll)
			}, 200)
		}

		pagesElement.addEventListener('scroll', onScroll)

		isScrollingPagesElement = true
		pagesElement.scroll({
			behavior: 'smooth',
			top: canvas.offsetTop - pagesElement.offsetTop - 20
		})
	}

	const onClickNextPage = () => {
		if (pageNumber + 1 <= numPages) {
			scrollToPage(pageNumber + 1)
		}
	}

	const onClickPreviousPage = () => {
		if (pageNumber - 1 > 0) {
			scrollToPage(pageNumber - 1)
		}
	}

	let pageNumberSpan: HTMLSpanElement
	const onInputPageNumber = (
		e: KeyboardEvent & {
			target: HTMLInputElement
		}
	) => {
		if (e.target && e.key === 'Enter') {
			const number = +e.target.value
			if (number < 1 || number > numPages) {
				e.target.value = pageNumber.toString()
				return
			}
			scrollToPage(number)
		}
	}

	$: if (pageNumberSpan) {
		pageNumberSpan.innerHTML = pageNumber.toString()

		const canvas = miniPagesElement?.querySelector<HTMLCanvasElement>(
			`canvas[data-page="${pageNumber}"]`
		)

		if (canvas) {
			miniPagesElement.scroll({
				behavior: 'smooth',
				top: canvas.offsetTop - miniPagesElement.offsetTop - 20
			})
		}
	}

	$: if (!isScrollingPagesElement && intersectionRatios.length > 0) {
		const maybePageNumber = intersectionRatios.indexOf(Math.max(...intersectionRatios)) + 1
		if (pageNumber !== maybePageNumber) pageNumber = maybePageNumber
	}
	// End Page Number

	// Zoom
	export let scale = 1.5
	export let maxScale = 3.1
	export let minScale = 0.25
	let scaleFactor = 0.2

	const onClickZoomIn = () => {
		if (scale + scaleFactor > maxScale) return
		scale = scale + scaleFactor
	}

	const onClickZoomOut = () => {
		if (scale - scaleFactor < minScale) return
		scale = scale - scaleFactor
	}

	$: if (pagesElement) {
		pagesElement
			.querySelectorAll<HTMLCanvasElement>('canvas.page[data-rendered="true"]')
			.forEach((canvas) => {
				renderPage({
					scale,
					canvas,
					number: +(canvas.getAttribute('data-page') || 1)
				})
			})
	}
	// End zoom

	// Download
	import downloadFile from './utils/downloadFile'
	export let filename: string = 'sample.pdf'
	const onClickDownload = () => {
		downloadFile({
			src,
			filename
		})
	}
	// End Download

	// Print
	import printFile from './utils/printFile'
	const onClickPrint = () => {
		printFile(src)
	}
	// End Print

	onMount(() => {
		pdfjsLib.getDocument(src).promise.then(async (pdf) => {
			pdfDoc = pdf
			numPages = pdf.numPages
		})
	})
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:this={el}
	class="flex flex-col h-screen overflow-hidden border border-white bg-base-100 border-opacity-10 rounded-xl"
>
	<div
		class="flex-none h-16 border-b border-white border-opacity-10 flex items-center justify-between px-5"
	>
		<div>
			<div class="text-lg font-medium">Resume.pdf</div>
		</div>

		<div>
			<div class="flex items-center space-x-1">
				<slot name="previous" onClick={onClickPreviousPage}>
					<div class="tooltip tooltip-left w-8 h-8" data-tip="Previous page">
						<button
							class="btn btn-circle btn-sm bg-base-300 border-base-300"
							class:disabled={pageNumber <= 1}
							on:click={onClickPreviousPage}
						>
							<Icon icon="material-symbols:chevron-left-rounded" class="text-lg" />
						</button>
					</div>
				</slot>

				<div class="bg-base-300 rounded-full h-8 px-3 space-x-1 flex items-center">
					<span class="relative min-w-[10px] h-6 px-1">
						<span bind:this={pageNumberSpan} />
						<input
							type="number"
							value={pageNumber}
							class="text-center absolute inset-0 bg-base-300"
							on:keyup={onInputPageNumber}
						/>
					</span>
					<span>of</span>
					<span>{numPages}</span>
				</div>

				<slot name="next" onClick={onClickNextPage}>
					<div class="tooltip tooltip-right w-8 h-8" data-tip="Next page">
						<button
							class="btn btn-circle btn-sm bg-base-300 border-base-300"
							class:disabled={pageNumber >= numPages}
							on:click={onClickNextPage}
						>
							<Icon icon="material-symbols:chevron-right-rounded" class="text-lg" />
						</button>
					</div>
				</slot>

				<div>
					<div class="h-6 w-0.5 rounded-full bg-white bg-opacity-10 mx-4" />
				</div>

				<slot name="zoomOut" onClick={onClickZoomOut}>
					<div class="tooltip tooltip-left w-8 h-8" data-tip="Zoom out">
						<button
							class="btn btn-circle btn-sm bg-base-300 border-base-300"
							class:disabled={pageNumber >= numPages}
							on:click={onClickZoomOut}
						>
							<Icon icon="solar:minimalistic-magnifer-zoom-out-broken" class="text-lg" />
							<!-- <Icon icon="ic:sharp-zoom-out" class="text-xl" /> -->
						</button>
					</div>
				</slot>
				<div class="text-sm bg-base-300 rounded-full h-8 px-3 flex items-center">
					{Math.round(scale * 100)}%
				</div>
				<slot name="zoomIn" onClick={onClickZoomIn}>
					<div class="tooltip tooltip-right w-8 h-8" data-tip="Zoom in">
						<button
							class="btn btn-circle btn-sm bg-base-300 border-base-300"
							class:disabled={pageNumber >= numPages}
							on:click={onClickZoomIn}
						>
							<Icon icon="solar:minimalistic-magnifer-zoom-in-broken" class="text-lg" />
							<!-- <Icon icon="ic:sharp-zoom-in" class="text-xl" /> -->
						</button>
					</div>
				</slot>
			</div>
		</div>

		<div class="flex items-center space-x-2">
			<slot name="download" onClick={onClickDownload}>
				<div class="tooltip tooltip-left w-8 h-8" data-tip="Download">
					<button class="btn btn-circle btn-sm" on:click={onClickDownload}>
						<Icon icon="mdi:download" class="text-lg" />
					</button>
				</div>
			</slot>
			<slot name="print" onClick={onClickPrint}>
				<div class="tooltip tooltip-left w-8 h-8" data-tip="Print">
					<button class="btn btn-circle btn-sm" on:click={onClickPrint}>
						<Icon icon="material-symbols:print" class="text-lg" />
					</button>
				</div>
			</slot>
		</div>
	</div>
	<div class="flex flex-1 overflow-hidden">
		<div
			bind:this={miniPagesElement}
			class="p-5 border-r border-white border-opacity-10 flex flex-col overflow-auto max-w-[198px] w-full space-y-2"
		>
			{#each [...Array(numPages).keys()] as index}
				<div
					role="button"
					data-page={index + 1}
					class={cn(
						'w-max border-2 p-1',
						pageNumber === index + 1
							? 'border-secondary'
							: 'border-transparent hover:border-secondary opacity-60'
					)}
					on:click={() => scrollToPage(index + 1)}
				>
					<canvas
						use:renderer
						data-mini={true}
						data-width="128"
						data-page={index + 1}
						class="mx-auto"
					/>
				</div>
			{/each}
		</div>
		<div
			bind:this={pagesElement}
			style={viewport
				? `--viewport-width:${viewport.width}px;--viewport-height:${viewport.height}px`
				: ''}
			class="flex pages flex-col flex-1 p-8 space-y-8 overflow-auto shadow-xl bg-base-300"
		>
			{#each [...Array(numPages).keys()] as index}
				<div class="w-full">
					<canvas use:renderer data-page={index + 1} class="mx-auto page bg-white" />
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.pages {
		--viewport-width: 0;
		--viewport-height: 0;
		canvas.page:not([data-rendered='true']) {
			width: var(--viewport-width);
			height: var(--viewport-height);
		}
	}
</style>

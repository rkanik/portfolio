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
		// pageRendering = false,
		numPages = 0

	export let scale = 1.5
	export let pageNumber = 1

	// let pendingPageNumber = -1

	type TPage = {
		number: number
		canvas: HTMLCanvasElement
	}

	// function queueRenderPage(page: TPage) {
	// 	if (pageRendering) {
	// 		pendingPageNumber = page.number
	// 	} else {
	// 		renderPage(page)
	// 	}
	// }

	// function onPrevPage() {
	// 	if (pageNumber <= 1) {
	// 		return
	// 	}
	// 	pageNumber--
	// 	queueRenderPage(pageNumber)
	// }

	// const onGoToNextPage = () => {
	// 	if (pageNumber >= pdfDoc.numPages) {
	// 		return
	// 	}
	// 	pageNumber++
	// 	queueRenderPage(pageNumber)
	// }

	function renderPage(event: TPage) {
		// pageRendering = true
		// Using promise to fetch the page
		pdfDoc.getPage(event.number).then((page: any) => {
			let innerScale = scale || 1
			let viewport = page.getViewport({ scale: innerScale })

			// const viewport = page.getViewport({ scale })

			const isMini = event.canvas.getAttribute('data-mini') === 'true'
			if (isMini) {
				innerScale = event.canvas.clientWidth / viewport.width
				viewport = page.getViewport({ scale: innerScale })
			}

			event.canvas.width = viewport.width
			event.canvas.height = viewport.height

			const renderTask = page.render({
				viewport,
				canvasContext: event.canvas.getContext('2d')
			})

			event.canvas.removeAttribute('style')
			event.canvas.setAttribute('data-rendered', 'true')

			renderTask.promise
			// Wait for rendering to finish
			// renderTask.promise.then(function () {
			// 	pageRendering = false
			// 	if (pendingPageNumber !== -1) {
			// 		// New page rendering is pending
			// 		renderPage(page)
			// 		pendingPageNumber = -1
			// 	}
			// })
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

	let intersectionTimeout: any
	$: {
		clearTimeout(intersectionTimeout)
		intersectionTimeout = setTimeout(() => {
			pageNumber = intersectionRatios.indexOf(Math.max(...intersectionRatios)) + 1
		}, 200)
	}

	let el: HTMLDivElement
	let pagesElement: HTMLDivElement

	const scrollToPage = (page: number) => {
		const canvas = pagesElement.querySelector(`.page[data-page="${page}"]`) as HTMLCanvasElement

		pagesElement.scroll({
			behavior: 'smooth',
			top: canvas.offsetTop - pagesElement.offsetTop - 20
		})
	}

	const onInputPageNumber = (e: any) => {
		const number = +e.target.value
		if (number < 1 || number > numPages) {
			e.currentTarget.value = pageNumber
			return
		}
		// console.log(e.target, e.currentTarget)
		scrollToPage(number)
	}

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
				<input
					type="number"
					value={pageNumber}
					class="text-center w-8 bg-base-300"
					on:input={onInputPageNumber}
				/>
				<span>/</span>
				<span>{numPages}</span>
			</div>
		</div>

		<div class="flex items-center space-x-2">
			<button class="btn btn-circle btn-sm">
				<Icon icon="mdi:download" class="text-lg" />
			</button>
		</div>
	</div>
	<div class="flex flex-1 overflow-hidden">
		<div class="p-5 border-r border-white border-opacity-10 w-48 flex justify-center overflow-auto">
			<div class="space-y-2 mb-5">
				{#each [...Array(numPages).keys()] as index}
					<div
						role="button"
						data-page={index + 1}
						class={cn(
							'w-32 border-2 p-1',
							pageNumber === index + 1
								? 'border-secondary'
								: 'border-transparent hover:border-secondary opacity-60'
						)}
						on:click={() => scrollToPage(index + 1)}
					>
						<canvas use:renderer data-mini={true} data-page={index + 1} class="mx-auto w-full" />
					</div>
				{/each}
			</div>
		</div>
		<div
			bind:this={pagesElement}
			class="flex flex-col flex-1 p-8 space-y-8 overflow-auto shadow-xl bg-base-300"
		>
			{#each [...Array(numPages).keys()] as index}
				<div class="w-full">
					<canvas
						use:renderer
						data-page={index + 1}
						class="mx-auto page"
						style="width:{500}px;height:{500 * 1.414}px"
					/>
				</div>
			{/each}
		</div>
	</div>
</div>

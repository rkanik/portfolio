<script lang="ts">
	import * as pdfjsLib from 'pdfjs-dist'
	import 'pdfjs-dist/web/pdf_viewer.css'

	import samplePdfURL from '$lib/sample.pdf'
	import { onMount } from 'svelte'
	import { keys } from 'lodash'

	pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
		'pdfjs-dist/build/pdf.worker.js',
		import.meta.url
	)

	let pdfDoc = null,
		pageNum = 1,
		pageRendering = false,
		pageNumPending = null,
		scale = 0.8,
		numPages = 0,
		canvas,
		ctx

	function queueRenderPage(num) {
		if (pageRendering) {
			pageNumPending = num
		} else {
			renderPage(num)
		}
	}

	function onPrevPage() {
		if (pageNum <= 1) {
			return
		}
		pageNum--
		queueRenderPage(pageNum)
	}

	function onNextPage() {
		if (pageNum >= pdfDoc.numPages) {
			return
		}
		pageNum++
		queueRenderPage(pageNum)
	}

	function renderPage(event: { pageNumber: number; canvas: HTMLCanvasElement }) {
		pageRendering = true
		// Using promise to fetch the page
		pdfDoc.getPage(event.pageNumber).then((page: any) => {
			const viewport = page.getViewport({ scale })

			let dataWidth = +(event.canvas.getAttribute('data-width') || viewport.width)
			let dataHeight = +(event.canvas.getAttribute('data-height') || viewport.height)

			// if (dataWidth) {
			// 	event.canvas.width = dataWidth
			// 	event.canvas.height = dataWidth * (viewport.height / viewport.width)
			// } else if (dataHeight) {
			// 	event.canvas.height = dataHeight
			// 	event.canvas.width = dataWidth * (viewport.width / viewport.height)
			// } else {
			// 	event.canvas.width = viewport.width
			// 	event.canvas.height = viewport.height
			// }
			event.canvas.width = viewport.width
			event.canvas.height = viewport.height

			const renderTask = page.render({
				viewport,
				canvasContext: event.canvas.getContext('2d')
			})

			if (dataWidth) {
				event.canvas.setAttribute(
					'style',
					`width:${event.canvas.width}px;height:${event.canvas.height}px;`
				)
			} else event.canvas.removeAttribute('style')

			// Wait for rendering to finish
			renderTask.promise.then(function () {
				pageRendering = false
				// if (pageNumPending !== null) {
				// 	// New page rendering is pending
				// 	renderPage(pageNumPending)
				// 	pageNumPending = null
				// }
			})
		})
	}

	const renderer = (canvas: HTMLCanvasElement) => {
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer.unobserve(canvas)
				renderPage({
					canvas,
					pageNumber: +(canvas.getAttribute('data-page') || 1)
				})
			}
		})
		observer.observe(canvas)
	}

	onMount(() => {
		pdfjsLib.getDocument(samplePdfURL).promise.then(async (pdf) => {
			pdfDoc = pdf

			numPages = pdf.numPages
		})
	})
</script>

<div
	class="flex flex-col h-screen overflow-hidden border border-white bg-base-100 border-opacity-10 rounded-xl"
>
	<div class="flex-none h-16 border-b border-white border-opacity-10" />
	<div class="flex flex-1 overflow-hidden">
		<div class="w-full max-w-xs border-r border-white border-opacity-10">
			{#each [...Array(numPages).keys()] as index}
				<div class="w-full">
					<canvas
						use:renderer
						data-width={100}
						data-page={index + 1}
						class="mx-auto"
						style="width:{100}px;height:{100 * 1.414}px"
					/>
				</div>
			{/each}
		</div>
		<div class="flex flex-col flex-1 p-8 space-y-8 overflow-auto shadow-xl bg-base-300">
			{#each [...Array(numPages).keys()] as index}
				<div class="w-full">
					<canvas
						use:renderer
						data-page={index + 1}
						class="mx-auto"
						style="width:{500}px;height:{500 * 1.414}px"
					/>
				</div>
			{/each}
		</div>
	</div>
</div>

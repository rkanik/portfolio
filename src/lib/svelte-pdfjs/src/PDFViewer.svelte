<script lang="ts">
	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	import * as pdfjsLib from 'pdfjs-dist'
	import 'pdfjs-dist/web/pdf_viewer.css'

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
		scale: number
		number: number
		canvas: HTMLCanvasElement
		container: HTMLDivElement
		isRendered: boolean
		isRendering: boolean
		textLayout?: HTMLDivElement
	}

	type TMiniPage = {
		width: number
		number: number
		isRendered: boolean
		canvas: HTMLCanvasElement
	}

	type TPageOrNot = TPage | undefined

	let viewport: any

	const renderPage = (event: TPage) => {
		if (event.isRendering) return

		setPage(event.number, (v = event) => ({
			...v,
			isRendering: true
		}))

		// Using promise to fetch the page
		pdfDoc.getPage(event.number).then(async (page: any) => {
			let innerScale = scale || event.scale || 1
			let innerViewport = page.getViewport({ scale: innerScale })

			if (!viewport || viewport.scale !== innerScale) {
				viewport = innerViewport
			}

			event.canvas.width = innerViewport.width
			event.canvas.height = innerViewport.height

			const renderTask = page.render({
				viewport: innerViewport,
				canvasContext: event.canvas.getContext('2d')
			})

			await renderTask.promise

			event.canvas.setAttribute('data-rendered', 'true')
			setPage(event.number, (v = event) => {
				return {
					...v,
					isRendered: true,
					isRendering: false,
					scale: innerScale
				}
			})

			if (event.textLayout) {
				pdfjsLib.renderTextLayer({
					textDivs: [],
					viewport: innerViewport,
					container: event.textLayout,
					textContentSource: await page.getTextContent()
				})
			}
		})
	}

	const renderMiniPage = (page: TMiniPage) => {
		pdfDoc.getPage(page.number).then(async (PDFPage: any) => {
			const scale = page.width / PDFPage.getViewport({ scale: 1 }).width
			const viewport = PDFPage.getViewport({ scale })

			page.canvas.width = viewport.width
			page.canvas.height = viewport.height

			const renderTask = PDFPage.render({
				viewport,
				canvasContext: page.canvas.getContext('2d')
			})

			renderTask.promise
		})
	}

	let intersectionRatios: number[] = []

	type IntersectOptions = {
		onEnter?: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void
		onLeave?: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void
		options?: IntersectionObserverInit
	}
	const onIntersect = (target: Element, init: IntersectOptions) => {
		const { options, onEnter = () => {}, onLeave = () => {} } = init

		// instance
		const observer = new IntersectionObserver(
			(entries, observer) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					return onEnter(entries, observer)
				}
				return onLeave(entries, observer)
			},
			//
			options
		)

		// observe
		observer.observe(target)

		// cleanup
		return {
			destroy() {
				observer.unobserve(target)
			}
		}
	}

	const miniIntersectionObserver = (
		node: HTMLDivElement,
		config: {
			width: number
			number: number
		}
	) => {
		onIntersect(node, {
			onEnter(_, observer) {
				observer.unobserve(node)
				renderMiniPage({
					isRendered: false,
					width: config.width,
					number: config.number,
					canvas: node.querySelector('canvas') as HTMLCanvasElement
				})
			}
		})
	}

	let pages: TPage[] = []

	const setPage = (number: number, updater: TPage | ((page?: TPage) => TPage)) => {
		let clonedPages = [...pages]

		let page = clonedPages.find((page) => {
			return page?.number === number
		})

		if (!page) {
			clonedPages[number] = typeof updater === 'function' ? updater(page) : updater
		}

		clonedPages = clonedPages.map((item) => {
			if (item?.number !== number) return item
			if (typeof updater === 'function') {
				page = updater(item)
				return page
			}
			return updater
		})

		pages = [...clonedPages]
		return page as TPage
	}

	const getPage = <P extends TPageOrNot>(
		number: number,
		page?: P
	): P extends undefined ? TPageOrNot : TPage => {
		const existedPage = pages.find((page) => {
			return page?.number === number
		})

		if (!existedPage && page) {
			setPage(number, page)
			return page
		}

		return existedPage as any
	}

	const renderer = (
		container: HTMLDivElement,
		config: {
			number: number
		}
	) => {
		const { number } = config

		const canvas = container.querySelector('canvas') as HTMLCanvasElement
		const newPage = setPage(number, {
			scale,
			number,
			canvas,
			container,
			isRendered: false,
			isRendering: false,
			textLayout: canvas.nextElementSibling as HTMLDivElement | undefined
		})

		onIntersect(container, {
			onEnter(entries) {
				//
				const page = getPage(number, newPage)
				if (!page.isRendered) {
					console.log('before render page', entries)
					renderPage(page)
				}
				intersectionRatios[number] = entries[0].intersectionRatio
			},
			onLeave() {
				intersectionRatios[number] = 0
			}
		})
	}

	// Page Number
	let pagesElement: HTMLDivElement
	let miniPagesElement: HTMLDivElement
	let isScrollingPagesElement = false

	const scrollToPage = (number: number) => {
		const page = getPage(number)
		console.log('scrollToPage', number, page, pages)

		if (!page) return

		let timeout: NodeJS.Timeout
		const onScroll = () => {
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				isScrollingPagesElement = false
				pagesElement.addEventListener('scroll', onScroll)
			}, 200)
		}

		pagesElement.addEventListener('scroll', onScroll)

		pageNumber = number
		isScrollingPagesElement = true
		pagesElement.scroll({
			behavior: 'smooth',
			top: page.container.offsetTop - pagesElement.offsetTop - 20
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
	const onInputPageNumber = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement
		if (target && e.key === 'Enter') {
			const number = +target.value
			if (number < 1 || number > numPages) {
				target.value = pageNumber.toString()
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
		const maybePageNumber = intersectionRatios.indexOf(
			Math.max(...intersectionRatios.filter(Boolean))
		)
		if (pageNumber !== maybePageNumber) {
			pageNumber = maybePageNumber
		}
	}
	// End Page Number

	// Zoom
	export let scale = 1.5
	export let maxScale = 3.1
	export let minScale = 0.25
	let scaleFactor = 0.2

	const onChangeScale = () => {
		console.log('onChangeScale')
		pages.forEach((page) => {
			if (page?.isRendered) {
				console.log('onChangeScale:renderPage', page)
				renderPage({
					...page,
					scale
				})
			}
		})
	}

	const onClickZoomIn = () => {
		if (scale + scaleFactor > maxScale) return
		scale = scale + scaleFactor
		onChangeScale()
	}

	const onClickZoomOut = () => {
		if (scale - scaleFactor < minScale) return
		scale = scale - scaleFactor
		onChangeScale()
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

	// Sidebar
	let isSidebarExpanded = true
	const onToggleSidebar = () => {
		isSidebarExpanded = !isSidebarExpanded
	}
	// End Sidebar

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
		class="flex items-center justify-between flex-none h-16 px-5 border-b border-white border-opacity-10"
	>
		<div class="flex items-center space-x-4">
			<button class="flex-none btn btn-circle btn-sm" on:click={onToggleSidebar}>
				<svg
					fill="none"
					class="w-4 h-4"
					viewBox="0 0 24 24"
					stroke="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</button>
			<div class="text-lg font-medium">Resume.pdf</div>
		</div>

		<div>
			<div class="flex items-center space-x-1">
				<slot name="previous" onClick={onClickPreviousPage}>
					<div class="w-8 h-8 tooltip tooltip-left" data-tip="Previous page">
						<button
							class="btn btn-circle btn-sm bg-base-300 border-base-300"
							class:disabled={pageNumber <= 1}
							on:click={onClickPreviousPage}
						>
							<Icon icon="material-symbols:chevron-left-rounded" class="text-lg" />
						</button>
					</div>
				</slot>

				<div class="flex items-center h-8 px-3 space-x-1 rounded-full bg-base-300">
					<span class="relative min-w-[10px] h-6 px-1">
						<span bind:this={pageNumberSpan} />
						<input
							type="number"
							value={pageNumber}
							class="absolute inset-0 text-center bg-base-300"
							on:keyup={onInputPageNumber}
						/>
					</span>
					<span>of</span>
					<span>{numPages}</span>
				</div>

				<slot name="next" onClick={onClickNextPage}>
					<div class="w-8 h-8 tooltip tooltip-right" data-tip="Next page">
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
					<div class="w-8 h-8 tooltip tooltip-left" data-tip="Zoom out">
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
				<div class="flex items-center h-8 px-3 text-sm rounded-full bg-base-300">
					{Math.round(scale * 100)}%
				</div>
				<slot name="zoomIn" onClick={onClickZoomIn}>
					<div class="w-8 h-8 tooltip tooltip-right" data-tip="Zoom in">
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
				<div class="w-8 h-8 tooltip tooltip-left" data-tip="Download">
					<button class="btn btn-circle btn-sm" on:click={onClickDownload}>
						<Icon icon="mdi:download" class="text-lg" />
					</button>
				</div>
			</slot>
			<slot name="print" onClick={onClickPrint}>
				<div class="w-8 h-8 tooltip tooltip-left" data-tip="Print">
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
			class={cn(
				'py-5 border-white border-opacity-10 flex flex-col overflow-auto w-full space-y-2 transition-all duration-500',
				{
					'max-w-[198px] px-5 border-r': isSidebarExpanded,
					'max-w-0 px-0 border-none': !isSidebarExpanded
				}
			)}
		>
			{#each [...Array(numPages).keys()] as index}
				<div
					use:miniIntersectionObserver={{
						width: 128,
						number: index + 1
					}}
					role="button"
					class={cn(
						'w-max border-2 p-1',
						pageNumber === index + 1
							? 'border-secondary'
							: 'border-transparent hover:border-secondary opacity-60'
					)}
					on:click={() => scrollToPage(index + 1)}
				>
					<canvas class="mx-auto" />
				</div>
			{/each}
		</div>
		<div
			bind:this={pagesElement}
			style={viewport
				? `--viewport-width:${viewport.width}px;--viewport-height:${viewport.height}px;`
				: `--viewport-width:${500}px;--viewport-height:${500 * 1.414}px;`}
			class="flex flex-col flex-1 p-8 space-y-8 overflow-auto shadow-xl pages bg-base-300"
		>
			{#each [...Array(numPages).keys()] as index}
				<div
					use:renderer={{
						number: index + 1
					}}
					class="relative mx-auto page"
				>
					<canvas class="mx-auto bg-white page" />
					<div id="text-layer" class="absolute inset-0 textLayer" style="--scale-factor:{scale};" />
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

		.page,
		canvas:not([data-rendered='true']) {
			width: var(--viewport-width);
			height: var(--viewport-height);
		}
	}
</style>

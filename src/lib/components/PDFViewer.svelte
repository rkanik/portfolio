<script lang="ts">
	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	import { usePDF } from 'sveltuse'

	export let src: string
	let pagesContainer: HTMLDivElement

	const {
		scale,
		viewport,
		numPages,
		pageNumber,
		pageNumbers,
		pageRenderer,
		thumbnailRenderer,
		goToNextPage,
		goToPreviousPage,
		setPageNumber,
		zoomIn,
		zoomOut,
		download,
		print
	} = usePDF({
		src,
		initialScale: 1.5,
		pagesContainerGetter: () => pagesContainer
	})

	let pageNumberSpan: HTMLSpanElement
	const onInputPageNumber = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement
		if (target && e.key === 'Enter') {
			setPageNumber(+target.value)
		}
	}

	// Sidebar
	let isSidebarExpanded = true
	const onToggleSidebar = () => {
		isSidebarExpanded = !isSidebarExpanded
	}
	// End Sidebar
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex flex-col h-[88vh] overflow-hidden border border-white bg-base-100 border-opacity-10 rounded-xl"
>
	<div
		class="flex items-center justify-between flex-none h-12 px-5 border-b border-white border-opacity-10"
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
				<div class="w-8 h-8 tooltip tooltip-left" data-tip="Previous page">
					<button
						class="btn btn-circle btn-sm bg-base-300 border-base-300"
						class:disabled={$pageNumber <= 1}
						on:click={goToPreviousPage}
					>
						<Icon icon="material-symbols:chevron-left-rounded" class="text-lg" />
					</button>
				</div>

				<div class="flex items-center h-8 px-3 space-x-1 rounded-full bg-base-300">
					<span class="relative min-w-[10px] h-6 px-1">
						<span bind:this={pageNumberSpan} />
						<input
							type="number"
							value={$pageNumber}
							class="absolute inset-0 text-center bg-base-300"
							on:keyup={onInputPageNumber}
						/>
					</span>
					<span>of</span>
					<span>{$numPages}</span>
				</div>

				<div class="w-8 h-8 tooltip tooltip-right" data-tip="Next page">
					<button
						class="btn btn-circle btn-sm bg-base-300 border-base-300"
						class:disabled={pageNumber >= numPages}
						on:click={goToNextPage}
					>
						<Icon icon="material-symbols:chevron-right-rounded" class="text-lg" />
					</button>
				</div>

				<div>
					<div class="h-6 w-0.5 rounded-full bg-white bg-opacity-10 mx-4" />
				</div>

				<div class="w-8 h-8 tooltip tooltip-left" data-tip="Zoom out">
					<button
						class="btn btn-circle btn-sm bg-base-300 border-base-300"
						class:disabled={pageNumber >= numPages}
						on:click={zoomOut}
					>
						<Icon icon="solar:minimalistic-magnifer-zoom-out-broken" class="text-lg" />
					</button>
				</div>

				<div class="flex items-center h-8 px-3 text-sm rounded-full bg-base-300">
					{Math.round($scale * 100)}%
				</div>

				<div class="w-8 h-8 tooltip tooltip-right" data-tip="Zoom in">
					<button
						class="btn btn-circle btn-sm bg-base-300 border-base-300"
						class:disabled={$pageNumber >= $numPages}
						on:click={zoomIn}
					>
						<Icon icon="solar:minimalistic-magnifer-zoom-in-broken" class="text-lg" />
					</button>
				</div>
			</div>
		</div>

		<div class="flex items-center space-x-2">
			<div class="w-8 h-8 tooltip tooltip-left" data-tip="Download">
				<button class="btn btn-circle btn-sm" on:click={() => download()}>
					<Icon icon="mdi:download" class="text-lg" />
				</button>
			</div>

			<div class="w-8 h-8 tooltip tooltip-left" data-tip="Print">
				<button class="btn btn-circle btn-sm" on:click={() => print()}>
					<Icon icon="material-symbols:print" class="text-lg" />
				</button>
			</div>
		</div>
	</div>
	<div class="flex flex-1 overflow-hidden">
		<!-- bind:this={miniPagesElement} -->

		<div
			class={cn(
				'py-5 border-white border-opacity-10 flex flex-col overflow-auto w-full space-y-2 transition-all duration-500',
				{
					'max-w-[198px] px-5 border-r': isSidebarExpanded,
					'max-w-0 px-0 border-none': !isSidebarExpanded
				}
			)}
		>
			{#each $pageNumbers as number}
				<!-- svelte-ignore a11y-interactive-supports-focus -->
				<div
					use:thumbnailRenderer={{
						number,
						width: 128
					}}
					role="button"
					class={cn(
						'w-max border-2 p-1',
						number === $pageNumber
							? 'border-secondary'
							: 'border-transparent hover:border-secondary opacity-60'
					)}
					on:click={() => setPageNumber(number)}
				>
					<canvas class="mx-auto" />
				</div>
			{/each}
		</div>
		<div
			bind:this={pagesContainer}
			style={viewport
				? `--viewport-width:${$viewport.width}px;--viewport-height:${$viewport.height}px;`
				: `--viewport-width:${500}px;--viewport-height:${500 * 1.414}px;`}
			class="flex flex-col flex-1 p-8 space-y-8 overflow-auto shadow-xl pages bg-base-300"
		>
			{#each $pageNumbers as number}
				<div use:pageRenderer={{ number }} class="relative mx-auto page">
					<canvas />
					<div
						id="text-layer"
						class="absolute inset-0 textLayer"
						style="--scale-factor:{$scale};"
					/>
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

	.page {
		&,
		canvas:not([data-rendered='true']) {
			width: var(--viewport-width);
			height: var(--viewport-height);
		}
	}
</style>

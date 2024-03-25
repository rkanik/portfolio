<script lang="ts">
	import type { AnyFn, Optional, TProject } from '$lib/types'

	import src from '$lib/utils/src'
	import Icon from '@iconify/svelte'
	import BaseIFrame from '$lib/components/base/BaseIFrame.svelte'
	import GithubRepository from '$lib/components/GithubRepository.svelte'
	import useRequestFullscreen from '$lib/composable/useRequestFullscreen'
	import { getPublicUrl } from '$lib/utils/getPublicUrl'
	import BaseImage from '$lib/components/base/BaseImage.svelte'
	import { createEventDispatcher } from 'svelte'

	export let project: TProject
	export let hideClose = false
	export let iFrame: Optional<{
		width?: number
		height?: number
		initialScale?: number
		renderOnMount?: boolean
	}> = undefined

	const dispatch = createEventDispatcher()
	export let onClose: Optional<AnyFn> = (e) => {
		dispatch('close', e)
	}

	let iframe: HTMLIFrameElement
	let iframeFullscreen = useRequestFullscreen(() => {
		return iframe
	})

	const onRequestFullscreen = () => {
		iframeFullscreen.show()
	}
</script>

<div
	class="flex min-h-[80vh] flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 overflow-hidden"
>
	<div class="flex flex-col flex-1 overflow-hidden">
		{#if project.previewUrl}
			<BaseIFrame
				bind:iframe
				width={iFrame?.width || 1366}
				height={iFrame?.height || 769}
				renderOnMount={iFrame?.renderOnMount ?? true}
				initialScale={iFrame?.initialScale || 0.828696925329429}
				title={project.name}
				src={project.previewUrl}
			/>
		{:else}
			{@const attachment = project.projectAttachments[0]?.attachments}
			{@const src = getPublicUrl(attachment, 'src')}
			<div>
				<BaseImage
					lazySrc={src}
					alt={project.name}
					src={attachment?.base64 || src}
					class="object-cover w-full h-full rounded-2xl"
				/>
			</div>
		{/if}
	</div>
	<div class="flex-none lg:max-w-sm w-full">
		<div class="flex items-center flex-none p-2 mb-5 rounded-2xl bg-base-100">
			<div class="px-2 text-base font-medium">Project Details</div>
			<div class="flex ml-auto space-x-1">
				{#if project.previewUrl}
					<div class="tooltip tooltip-left tooltip-primary" data-tip="Enter to fullscreen">
						<button class="btn btn-circle btn-sm" on:click={onRequestFullscreen}>
							<Icon class="text-xl" icon="iconamoon:screen-full" />
						</button>
					</div>
				{/if}
				{#if project.sourceCodeUrl}
					<div class="tooltip tooltip-left tooltip-primary" data-tip="View source code">
						<a
							href={project.sourceCodeUrl}
							target="_blank"
							rel="noreferrer"
							class="btn btn-circle btn-sm"
						>
							<Icon class="text-xl" icon="material-symbols:code" />
						</a>
					</div>
				{/if}
				<div class="tooltip tooltip-left tooltip-primary" data-tip="Open in new tab">
					<a
						href={project.previewUrl}
						target="_blank"
						rel="noreferrer"
						class="btn btn-circle btn-sm"
					>
						<Icon class="text-xl" icon="material-symbols:open-in-new-rounded" />
					</a>
				</div>

				{#if !hideClose}
					<div class="tooltip tooltip-left tooltip-primary" data-tip="Close modal">
						<button class="btn btn-circle btn-sm" on:click={onClose}>
							<Icon class="text-xl" icon="mdi:close" />
						</button>
					</div>
				{/if}
			</div>
		</div>

		<div class="p-5 bg-base-100 rounded-2xl space-y-6">
			<div>
				<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Name</div>
				<h4>
					{project.name}
				</h4>
			</div>

			<div>
				<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Description</div>
				<p>
					{@html project.description}
				</p>
			</div>

			{#if project.sourceCodeUrl}
				<div>
					<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Source Code</div>
					<a
						href={project.sourceCodeUrl}
						target="_blank"
						rel="noreferrer"
						class="hover:underline text-blue-500"
					>
						{project.sourceCodeUrl}
					</a>
				</div>
			{/if}

			{#if project.previewUrl}
				<div>
					<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Website</div>
					<a
						href={project.previewUrl}
						target="_blank"
						rel="noreferrer"
						class="hover:underline text-blue-500"
					>
						{project.previewUrl}
					</a>
				</div>
			{/if}

			<div>
				<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Technologies</div>
				<div class="flex flex-wrap max-w-xs -mt-1 -ml-1">
					{#if Array.isArray(project.projectTechnologies)}
						{#each project.projectTechnologies as item}
							<div class="badge ml-1 mt-1 pb-0.5 space-x-1 items-center">
								<Icon icon={item.technologies?.icon} class="text-sm mt-0.5" />
								<div>{item.technologies?.name}</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			{#if project.repository}
				<GithubRepository
					repository={project.repository}
					hideName
					class="space-y-6"
					hideDescription
				/>
			{/if}
		</div>
	</div>
</div>

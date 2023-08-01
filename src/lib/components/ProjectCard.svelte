<script lang="ts">
	import type { TProject } from '$lib/types'
	import { getPublicUrl } from '$lib/utils/getPublicUrl'
	import src from '$lib/utils/src'
	import Icon from '@iconify/svelte'
	import truncate from 'lodash/truncate'
	import { createEventDispatcher } from 'svelte'
	import BaseImage from './base/BaseImage.svelte'

	const dispatch = createEventDispatcher()

	export let project: TProject = null!
	export let showThumbnail = true
</script>

<div
	class="relative overflow-hidden border-white card card-bordered bg-base-100 border-opacity-10 rounded-xl"
>
	{#if project?.repository?.owner && project.repository.owner.login !== 'rkanik'}
		<a
			target="_blank"
			rel="noreferrer"
			href={project.repository.owner.html_url}
			class="flex items-center space-x-1 absolute top-1 left-1 z-10 bg-black text-white rounded-full pr-3 p-0.5 bg-opacity-50 backdrop-blur"
		>
			<div class="avatar">
				<div class="w-7 rounded-full bg-white">
					<img
						alt={project.repository.owner.login}
						src={project.repository.owner.avatar_url}
						class="p-0.5 rounded-full"
					/>
				</div>
			</div>
			<div class="text-sm font-slab font-medium">{project.repository.owner.login}</div>
		</a>
	{/if}

	{#if showThumbnail}
		{@const attachment = project.projectAttachments[0]?.attachments}
		{@const src = getPublicUrl(attachment, 'medium')}
		<a href="/projects/{project.slug}" class="relative h-56 overflow-hidden">
			<BaseImage
				lazySrc={src}
				alt={project.name}
				src={attachment?.base64 || src}
				class="object-cover object-top w-full h-full transition-transform duration-500 ease-in-out transform scale-100 hover:scale-125"
			/>
		</a>
	{/if}

	<div class="border-t border-white card-body border-opacity-10">
		<h2 class="flex items-center justify-between card-title">
			<a
				href="/projects/{project.slug}"
				class="hover:underline underline-offset-3 decoration-secondary"
			>
				<span>{project.name}</span>
			</a>
			<div class="flex space-x-2">
				<button class="btn btn-sm btn-circle" on:click={() => dispatch('click', project)}>
					<Icon icon="material-symbols:info-outline-rounded" class="text-xl" />
				</button>
				{#if project.sourceCodeUrl}
					<a
						class="btn btn-sm btn-circle"
						href={project.sourceCodeUrl}
						target="_blank"
						rel="noreferrer"
					>
						<Icon icon="material-symbols:code" class="text-xl" />
					</a>
				{/if}
				{#if project.previewUrl}
					<a
						class="btn btn-sm btn-circle"
						href={project.previewUrl}
						target="_blank"
						rel="noreferrer"
					>
						<Icon icon="material-symbols:monitor-outline" class="text-xl" />
					</a>
				{/if}
			</div>
		</h2>

		<p>{truncate(project.description || '', { length: 115 })}</p>

		<div class="mt-2">
			<div class="flex flex-wrap max-w-xs -mt-1 -ml-1">
				{#if Array.isArray(project.projectTechnologies)}
					{#each project.projectTechnologies as item}
						<div class="badge ml-1 mt-1 pb-0.5 space-x-1 items-center">
							<div class="w-3.5 h-3.5">
								<Icon icon={item.technologies?.icon} class="text-sm mt-0.5" />
							</div>
							<div>{item.technologies?.name}</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

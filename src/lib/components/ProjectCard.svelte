<script lang="ts">
	import type { TProject } from '$lib/types'
	import src from '$lib/utils/src'
	import Icon from '@iconify/svelte'
	import truncate from 'lodash/truncate'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let project: TProject = null!
	export let glass = true
	export let showThumbnail = true
</script>

<div
	class="overflow-hidden card card-bordered bg-base-100 border-white border-opacity-10 rounded-xl"
>
	{#if showThumbnail}
		<button class="relative h-48 overflow-hidden" on:click={() => dispatch('click', project)}>
			<img
				alt={project.name}
				src={src(project.projectAttachments?.[0]?.attachments?.thumbnail)}
				class="object-cover w-full h-full transition-transform duration-500 ease-in-out transform scale-100 hover:scale-125"
			/>
		</button>
	{/if}
	<div class="card-body border-t border-white border-opacity-10">
		<h2 class="flex items-center justify-between card-title">
			<span>{project.name}</span>
			<div class="flex space-x-2">
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
							<Icon icon={item.technologies?.icon} class="text-sm mt-0.5" />
							<div>{item.technologies?.name}</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { page } from '$app/stores'
	import BaseImage from '$lib/components/base/BaseImage.svelte'
	import TextField from '$lib/components/base/TextField.svelte'
	import { createProjectsQuery } from '$lib/queries/createProjectsQuery.js'
	import cn from '$lib/utils/cn'
	import { getPublicUrl } from '$lib/utils/getPublicUrl.js'
	import { usePaneGroup } from '$lib/utils/usePaneGroup'
	import { Pane, PaneGroup, PaneResizer } from 'paneforge'
	import { onMount } from 'svelte'
	const { layout, onLayoutChange } = usePaneGroup('projects-slug-layout', [20, 80])

	let container: HTMLDivElement
	let classes = 'flex flex-col overflow-hidden'
	onMount(() => {
		classes.split(' ').forEach((token) => {
			container.parentElement?.classList.add(token)
		})
	})

	$: query = createProjectsQuery()

	let q = ''
	$: projects = ($query.data?.data || []).filter((project) => {
		return project.name.toLowerCase().includes(q.toLowerCase())
	})
</script>

<div bind:this={container} class={cn('flex-1', classes)}>
	<PaneGroup direction="horizontal" {onLayoutChange}>
		<Pane defaultSize={layout?.[0]} minSize={20} maxSize={50} class="flex-col flex">
			<div class="h-12 border-b border-base-100" />
			<div class="p-2">
				<input
					type="text"
					placeholder="Search..."
					bind:value={q}
					class="input input-bordered input-sm w-full"
				/>
			</div>
			<div class="flex-1 overflow-auto gap-1">
				<ul class="menu px-2 py-0 pb-2 gap-1">
					{#each projects as project}
						{@const attachment = project.projectAttachments?.[0]?.attachments}
						{@const src = getPublicUrl(attachment)}
						<li>
							<a
								href="/admin/projects/{project.slug}"
								class={cn('px-2 py-1 flex bg-base-300 hover:bg-base-100 rounded-lg space-x-1', {
									'active hover:!bg-primary': project.slug === $page.params.slug
								})}
							>
								<div class="flex-none w-8 h-8">
									<BaseImage
										lazySrc={src}
										alt={attachment?.name || ''}
										src={attachment?.base64 || src}
										class="object-cover h-full w-full object-top rounded"
									/>
								</div>
								<div>
									<h6 class="font-medium text-sm">{project.name}</h6>
									<p
										class={cn('line-clamp-2 text-xs text-neutral-500', {
											'text-neutral-300': project.slug === $page.params.slug
										})}
									>
										{project.description}
									</p>
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</Pane>
		<PaneResizer class="w-px relative h-full flex flex-col items-center">
			<div class="w-px bg-base-100 flex-1" />
		</PaneResizer>
		<Pane defaultSize={layout?.[1]} class="flex-col flex">
			<div class="flex-1 overflow-auto">
				<slot />
			</div>
		</Pane>
	</PaneGroup>
</div>

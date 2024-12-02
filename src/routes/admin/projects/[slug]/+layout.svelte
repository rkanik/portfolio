<script lang="ts">
	import { page } from '$app/stores'
	import cn from '$lib/utils/cn'
	import { usePaneGroup } from '$lib/utils/usePaneGroup'
	import { Pane, PaneGroup, PaneResizer } from 'paneforge'
	import { onMount } from 'svelte'
	const { layout, onLayoutChange } = usePaneGroup('projects-slug-layout', [20, 80])

	export let data

	let container: HTMLDivElement
	let classes = 'flex flex-col overflow-hidden'
	onMount(() => {
		classes.split(' ').forEach((token) => {
			container.parentElement?.classList.add(token)
		})
	})
</script>

<div bind:this={container} class={cn('flex-1', classes)}>
	<PaneGroup direction="horizontal" {onLayoutChange}>
		<Pane defaultSize={layout?.[0]} minSize={20} maxSize={50} class="flex-col flex">
			<div class="flex-1 overflow-auto">
				<ul class="menu px-1 py-2">
					{#each data.projects.data || [] as project}
						<li>
							<a
								href="/admin/projects/{project.slug}"
								class={cn('px-2 py-1 block bg-base-300 hover:bg-base-100 rounded text-sm', {
									active: project.slug === $page.params.slug
								})}
							>
								{project.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</Pane>
		<PaneResizer class="w-2 relative h-full flex flex-col items-center">
			<div class="w-px bg-base-100 flex-1" />
		</PaneResizer>
		<Pane defaultSize={layout?.[1]} class="flex-col flex">
			<div class="flex-1 overflow-auto">
				<slot />
			</div>
		</Pane>
	</PaneGroup>
</div>

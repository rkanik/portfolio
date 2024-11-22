<script lang="ts">
	import type { Maybe, TProjectAttachment } from '$lib/types'
	import type { OnSelectHandlerMultiple } from '$lib/components/StorageManager2.svelte'

	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { useStates } from 'sveltuse'
	import { goto } from '$app/navigation'
	import { useProjects } from '$lib/modules/Projects'
	import { getPublicUrl } from '$lib/utils/getPublicUrl'
	import { getNewSortOrder } from '$lib/utils/getNewSortOrder'
	import { getAverageSortOrder } from '$lib/utils/getAverageSortOrder'

	import cn from '$lib/utils/cn'

	import Icon from '@iconify/svelte'
	import BaseImage from '$lib/components/base/BaseImage.svelte'
	import StoragePicker from '$lib/components/StoragePicker.svelte'
	import SvelteSortable from 'sveltuse/dist/components/SvelteSortable.svelte'
	import ProjectFormBasic from '$lib/components/project/ProjectFormBasic.svelte'
	import ProjectPreviewForm from '$lib/components/project/ProjectPreviewForm.svelte'
	import ProjectRepositoryForm from '$lib/components/project/ProjectRepositoryForm.svelte'
	import ProjectFormTechnologies from '$lib/components/project/ProjectFormTechnologies.svelte'

	export let data
	let { project, supabase, technologies } = data

	const Projects = useProjects()
	const fetchProject = async () => {
		const { error, data } = await Projects.get({
			slug: $page.params.slug
		})
		if (!error) project = data
	}

	let storageModal = false
	const onSelectAttachments: OnSelectHandlerMultiple = async (
		attachments,
		{ reset: clearSelected }
	) => {
		if (!project) return

		storageModal = false
		clearSelected()

		const sortOrder = await getNewSortOrder({
			add: 1,
			ascending: false,
			table: 'project_attachments'
		})

		await supabase.from('project_attachments').insert(
			attachments.map((attachment, index) => ({
				projectId: project.id,
				attachmentId: attachment.id,
				sortOrder: sortOrder + index
			}))
		)

		fetchProject()
	}

	const onDeleteProjectAttachment = (projectAttachment: TProjectAttachment) => async () => {
		if (confirm(`Are you sure to delete this attachment?`)) {
			await supabase.from('project_attachments').delete().eq('id', projectAttachment.id)
			fetchProject()
		}
	}

	const onChangeProjectAttachmentSortOrder = async (newIndex: number) => {
		const { item: projectAttachment } = getAverageSortOrder(
			project?.projectAttachments || [],
			newIndex
		)

		const { error, data: updatedProjectAttachment } = await supabase
			.from('project_attachments')
			.update({ sortOrder: projectAttachment.sortOrder })
			.eq('id', projectAttachment.id)
			.select('*,attachments(*)')
			.single()

		if (error) {
			console.log('onChangeProjectAttachmentSortOrder', { error })
			return
		}

		project.projectAttachments = project.projectAttachments.map((item) => {
			return item.id === updatedProjectAttachment.id
				? { ...item, sortOrder: updatedProjectAttachment.sortOrder }
				: item
		})
	}

	// ==> TAB
	const tabs = ['Basic', 'Technologies', 'Images', 'Preview', 'Repository'] as const
	const initialTab = (): typeof tabs[number] => {
		const queryTab = $page.url.searchParams.get('tab') as Maybe<typeof tabs[number]>
		if (queryTab && tabs.includes(queryTab)) return queryTab
		return 'Basic'
	}
	const currentTab = useStates(tabs, initialTab())
	const setCurrentTab = (tab: typeof tabs[number]) => () => {
		currentTab.set(tab)
		goto(`/admin/projects/${project?.slug || ''}?tab=${tab}`)
	}
	// <== TAB

	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

<div class="w-full max-w-4xl py-16 mx-auto">
	{#if project}
		<div>
			<h1 class="text-2xl font-medium">
				{project?.name}
			</h1>
		</div>

		<div class="mt-4">
			<div class="tabs tabs-boxed">
				{#each tabs as tab}
					<button class="tab" class:tab-active={$currentTab === tab} on:click={setCurrentTab(tab)}>
						{tab}
					</button>
				{/each}
			</div>
		</div>

		{#if $currentTab === 'Basic'}
			<ProjectFormBasic bind:project />
		{:else if $currentTab === 'Technologies'}
			<ProjectFormTechnologies bind:project class="mt-4" {technologies} />
		{:else if $currentTab === 'Images'}
			<div class="mt-4">
				<h2 class="font-medium text-lg">Project Images</h2>
				<div class="opacity-70">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptate eveniet
					ratione ut dicta! Earum ratione a molestiae pariatur, eius sed laudantium non, ipsam
					quidem facere odio ipsum obcaecati distinctio.
				</div>

				{#if project}
					<SvelteSortable
						bind:items={project.projectAttachments}
						options={{ animation: 150, draggable: '.attachment' }}
						onUpdated={onChangeProjectAttachmentSortOrder}
						class="grid 2xl:grid-cols-5 gap-4 mt-4"
					>
						{#each project.projectAttachments as projectAttachment}
							{@const src = getPublicUrl(projectAttachment.attachments)}
							<div class="relative attachment">
								<button
									class="btn btn-circle btn-error btn-sm absolute top-1 right-1"
									on:click={onDeleteProjectAttachment(projectAttachment)}
								>
									<Icon class="text-base" icon="mdi-delete-outline" />
								</button>
								<BaseImage
									class="h-36 w-full object-top object-cover rounded"
									lazySrc={src}
									alt={projectAttachment.attachments.name}
									src={projectAttachment.attachments.base64 || src}
								/>
							</div>
						{/each}
						<StoragePicker bind:modal={storageModal} onSelect={onSelectAttachments}>
							<button
								on:click={() => (storageModal = true)}
								class="h-36 grid place-items-center bg-base-100 rounded shadow"
							>
								<Icon class="text-7xl text-white text-opacity-20" icon="mdi-plus" />
							</button>
						</StoragePicker>
					</SvelteSortable>
				{/if}
			</div>
		{:else if $currentTab === 'Preview'}
			<ProjectPreviewForm bind:project class="mt-4" />
		{:else if $currentTab === 'Repository'}
			<ProjectRepositoryForm bind:project class="mt-4" />
		{/if}
	{/if}
</div>

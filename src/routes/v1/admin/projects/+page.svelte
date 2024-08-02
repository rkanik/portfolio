<script lang="ts">
	import type { BaseFormField, TId, TProject, TUser } from '$lib/types'

	import Icon from '@iconify/svelte'
	import BaseImage from '$lib/components/base/BaseImage.svelte'
	import BaseModal from '$lib/components/base/BaseModal.svelte'
	import BaseFormOld from '$lib/components/base/BaseFormOld.svelte'
	import BaseDataTable from '$lib/components/base/BaseDataTable.svelte'
	import BaseActionsDropdown from '$lib/components/base/BaseActionsDropdown.svelte'

	import cn from '$lib/utils/cn'
	import d from '$lib/utils/dayjs'

	import { goto } from '$app/navigation'
	import { useProjects } from '$lib/modules/Projects'
	import { getPublicUrl } from '$lib/utils/getPublicUrl'
	import { getAverageSortOrder } from '$lib/utils/getAverageSortOrder'
	import type { Nullable } from 'sveltuse/dist/integrations/useSortable/index.js'
	import ProjectDetails from '$lib/components/project/ProjectDetails.svelte'
	import BasePagination from '$lib/components/base/BasePagination.svelte'

	export let data
	let { projects } = data

	const fields: BaseFormField[] = [
		{
			name: 'name',
			type: 'text',
			label: 'Name',
			placeholder: 'Enter the name of the project'
		}
	]

	const form = {
		create: {
			fields,
			data: {
				name: ''
			}
		}
	}

	let modal = false
	const Projects = useProjects()

	// List
	const onFetchProjects = async (filter: any = {}) => {
		if (!data.user) return
		const { error, data: list } = await Projects.list({
			userId: data.user.id,
			...filter
		})
		data.error = error
		projects = { ...list }
	}

	const onChangePagination = async (event: any) => {
		const { data: _projects } = await Projects.list({
			userId: (data.user as TUser).id,
			page: event.page,
			perPage: event.perPage
		})
		projects = { ..._projects }
	}

	// Create
	const onSubmit = async (event: CustomEvent<typeof form.create.data>) => {
		event.preventDefault()
		try {
			const { error, data: project } = await Projects.create({
				name: event.detail.name,
				userId: data.user?.id as string
			})

			if (error || !project) {
				console.log('onSubmit', { error })
				return
			}

			goto(`/admin/projects/${project.slug}`)
		} catch (error) {
			console.log('onSubmit', error)
		}
	}

	const update = (id: TId, updated: Partial<TProject>) => {
		projects.data = projects.data.map((item) => {
			return item.id === id ? { ...item, ...updated } : item
		})
	}

	// View
	let viewModal = false
	let currentProject: Nullable<TProject> = null
	const onView = async (event: CustomEvent<TProject>) => {
		currentProject = { ...event.detail }
		viewModal = true
	}

	// Status
	const onToggleStatus = async (event: CustomEvent<TProject>) => {
		const { data: project } = await Projects.update(event.detail.id, {
			status: event.detail.status === 'active' ? 'inactive' : 'active'
		})
		if (project) update(project.id, project)
	}

	// Sort Order
	const onSortableUpdated = async (index: number) => {
		const { item, sortOrder } = getAverageSortOrder(projects.data, index)
		const { data: project } = await Projects.update(item.id, { sortOrder })
		if (project) update(project.id, project)
	}

	// Delete
	const onDelete = async (event: CustomEvent<TProject>) => {
		if (confirm('Are you sure you want delete this project?')) {
			const { data } = await Projects.delete(event.detail.id)
			projects.data = projects.data.filter((project) => {
				return !data.some((item) => item.id === project.id)
			})
		}
	}

	// onSearch
	const onSearch = (fields: any) => {
		if (fields.name) {
			onFetchProjects(fields)
		}
	}
</script>

<svelte:head>
	<title>Projects | Rasel Khandkar</title>
</svelte:head>

<div class="container px-4 py-4 mx-auto md:px-0 md:py-5">
	<div class="flex items-center justify-between py-2">
		<h1 class="text-2xl font-medium">Projects</h1>

		<BaseModal
			bind:value={modal}
			title="Create new project"
			activator={{ class: 'btn btn-sm btn-primary', text: 'New Project' }}
		>
			<BaseFormOld
				bind:data={form.create.data}
				fields={form.create.fields}
				on:submit={onSubmit}
				on:cancel={() => (modal = false)}
			/>
		</BaseModal>

		<!-- eager={false} -->
		<BaseModal
			bind:value={viewModal}
			hideClose
			activator={false}
			modalBox="max-w-7xl bg-gray-700"
			let:onClose
		>
			{#if currentProject}
				<ProjectDetails
					{onClose}
					project={currentProject}
					iFrame={{
						renderOnMount: false,
						initialScale: 0.6061493411420205
					}}
				/>
			{/if}
		</BaseModal>
	</div>
	<div class="w-full mt-5 overflow-x-auto">
		<BaseDataTable
			bind:items={projects.data}
			{onSortableUpdated}
			actions
			sortable
			headers={[
				{
					text: 'Project',
					value: 'project',
					search: {
						type: 'text',
						name: 'name',
						placeholder: 'Search name...'
					}
				},
				{ text: 'Technologies', value: 'technologies' },
				{ text: 'Links', value: 'links' },
				{ text: 'Status', value: 'status' },
				{ text: 'Created', value: 'createdAt' },
				{ text: 'Updated', value: 'updatedAt' }
			]}
			{onSearch}
		>
			<svelte:fragment slot="item" let:item let:header let:value>
				{#if header.value === 'technologies'}
					<div class="flex flex-wrap max-w-xs -mt-1 -ml-1">
						{#each item.projectTechnologies as technology}
							<div class="flex items-center mt-1 ml-1 space-x-1 badge">
								<Icon icon={technology.technologies.icon} class="text-sm" />
								<span>{technology.technologies.name}</span>
							</div>
						{/each}
					</div>
				{:else if header.value === 'project'}
					{@const attachment = item.projectAttachments[0]?.attachments}
					{@const src = getPublicUrl(attachment)}
					<div class="flex items-center py-2 space-x-4">
						<div class="flex-none w-12 h-12">
							<BaseImage
								lazySrc={src}
								alt={attachment?.name || ''}
								src={attachment?.base64 || src}
								class="object-cover h-full w-full object-top rounded"
							/>
						</div>
						<div>
							<h5 class="text-base font-medium">{item.name}</h5>
							<p class="max-w-sm overflow-hidden text-sm opacity-50 max-h-16">{item.description}</p>
						</div>
					</div>
				{:else if header.value === 'links'}
					<div class="flex space-x-2">
						<a
							class="btn btn-sm btn-circle"
							href={item.sourceCodeUrl}
							target="_blank"
							rel="noreferrer"
						>
							<Icon icon="material-symbols:code" class="text-xl" />
						</a>
						<a
							class="btn btn-sm btn-circle"
							href={item.previewUrl}
							target="_blank"
							rel="noreferrer"
						>
							<Icon icon="material-symbols:monitor-outline" class="text-xl" />
						</a>
					</div>
				{:else if header.value === 'createdAt'}
					{d.utc(item.createdAt).format('DD MMM, YYYY hh:mma')}
				{:else if header.value === 'updatedAt'}
					{d.utc(item.updatedAt).fromNow()}
				{:else if header.value === 'status'}
					<div
						class={cn('badge', {
							'badge-primary': item.status === 'active'
						})}
					>
						{item.status}
					</div>
				{:else}
					{value}
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="actions" let:item>
				<BaseActionsDropdown
					{item}
					actions={[
						{ text: 'View', event: 'view', icon: 'ic:baseline-remove-red-eye' },
						{
							text: 'Update',
							href: `/admin/projects/${item.slug}`,
							icon: 'ph:pencil'
						},
						{
							event: 'status',
							text: item.status === 'active' ? 'Disable Project' : 'Enable',
							icon: 'material-symbols:do-not-disturb-on-outline'
						},
						{ divider: true },
						{ text: 'Delete', event: 'delete', icon: 'ic:outline-delete' }
					]}
					on:view={onView}
					on:delete={onDelete}
					on:status={onToggleStatus}
				/>
			</svelte:fragment>
		</BaseDataTable>

		<!-- <BasePagination
			page={projects.page}
			total={projects.count}
			perPage={projects.perPage}
			onChange={onChangePagination}
		/> -->
	</div>
</div>

<script lang="ts">
	import BaseDataTable from '$lib/components/base/BaseDataTable.svelte'
	import BaseFormOld from '$lib/components/base/BaseFormOld.svelte'
	import BaseModal from '$lib/components/base/BaseModal.svelte'
	import { getSupabaseContext } from '$lib/store/useSupabase'
	import dataURLtoFile from '$lib/utils/dataURLtoFile'
	import d from '$lib/utils/dayjs.js'
	import src from '$lib/utils/src'
	import useSupabaseStorage, { type SupabaseFile } from '$lib/utils/useSupabaseStorage'
	import { resizeImage } from '$lib/utils/resizeImage'
	import Icon from '@iconify/svelte'
	import BaseActionsDropdown from '$lib/components/base/BaseActionsDropdown.svelte'
	import type { BaseFormField, BaseFormFieldOption, TProject } from '$lib/types.js'
	import cn from '$lib/utils/cn.js'
	import Project from '$lib/models/ProjectModel.js'
	import { useContextStoreContext } from '$lib/store/useContextStore.js'

	export let data

	const fields: BaseFormField[] = [
		{
			name: 'name',
			type: 'text',
			label: 'Name',
			placeholder: 'Enter the name of the project'
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description',
			placeholder: 'Write project description...'
		},
		{
			name: 'previewUrl',
			type: 'text',
			label: 'Preview URL',
			prefix: 'https://',
			placeholder: 'Live preview url of the project'
		},
		{
			name: 'sourceCodeUrl',
			type: 'text',
			label: 'Source code URL',
			prefix: 'https://',
			placeholder: 'Open source code url like github or gitlab.'
		},
		{
			name: 'attachments',
			type: 'file',
			multiple: true,
			accept: 'image/*',
			label: 'Attachments',
			placeholder: 'Choose attachments'
		},
		{
			name: 'tagList',
			type: 'combobox',
			label: 'Tags',
			placeholder: 'Write tags...',
			options: []
		}
	]

	const form = {
		update: {
			fields: [...fields, { name: 'sortOrder', type: 'text', label: 'Sort Order' }],
			modal: false,
			data: {
				name: '',
				description: '',
				previewUrl: '',
				sourceCodeUrl: '',
				tagList: [],
				attachments: []
			} as any
		},
		create: {
			fields,
			data: {
				name: '',
				description: '',
				previewUrl: '',
				sourceCodeUrl: '',
				tagList: [],
				attachments: []
			} as {
				name: string
				description: string
				previewUrl: string
				sourceCodeUrl: string
				tagList: { text: string; value: string }[]
				attachments: FileList | File[]
			}
		}
	}

	let modal = false
	// const context = useContextStoreContext()
	// const supabase = getSupabaseContext()
	const storage = useSupabaseStorage(data.supabase)

	// List
	const onFetchProjects = async () => {
		data.projects = await data.supabase
			.from('projects')
			.select(`*,projectAttachments(*,attachments(*))`)
			.order('sortOrder', { ascending: true })
	}

	const onSubmit = async (event: CustomEvent<typeof form.create.data>) => {
		event.preventDefault()
		try {
			await data.supabase.rpc('increment_project_sort_orders', { sort_order_above: 0 })
			const projectInsertResponse = await data.supabase
				.from('projects')
				.insert({
					sortOrder: 1,
					slug: event.detail.name.split(' ').join('-').trim().toLowerCase(),
					userId: data.session?.user.id as string,
					name: event.detail.name,
					description: event.detail.description,
					previewUrl: event.detail.previewUrl,
					sourceCodeUrl: event.detail.sourceCodeUrl
					// tags: event.detail.tagList.map((tag) => tag.value.toLowerCase()).join(',')
				})
				.select()

			if (projectInsertResponse.error) {
				console.log('projectInsertResponse:error', projectInsertResponse)
				return
			}

			const resizedFiles = await Promise.all(
				Array.from(event.detail.attachments).map(async (file) => {
					return {
						file,
						file400: dataURLtoFile(await resizeImage(file, { maxWidth: 400 }), file.name),
						file1200: dataURLtoFile(await resizeImage(file, { maxWidth: 1200 }), file.name),
						base64: await resizeImage(file, { maxWidth: 3 })
					}
				})
			)

			const attachments = await Promise.all(
				resizedFiles.map(async (item) => {
					const [src, thumbnail] = await storage.uploadMany(
						[
							item.file1200 && {
								path: 'projects',
								bucket: 'uploads',
								file: item.file1200
							},
							item.file400 && {
								path: 'projects',
								bucket: 'uploads',
								file: item.file400
							}
						].filter(Boolean) as SupabaseFile[]
					)
					return {
						name: item.file.name,
						mimeType: item.file.type,
						src: src.data?.path,
						thumbnail: thumbnail.data?.path,
						base64: item.base64
					}
				})
			)

			const attachmentsResponse = await data.supabase
				.from('attachments')
				.insert(
					attachments
						.filter((v) => !!v.src)
						.map((attachment) => {
							return {
								name: attachment.name,
								base64: attachment.base64,
								src: attachment.src as string,
								thumbnail: attachment.thumbnail,
								mimeType: attachment.mimeType
							}
						})
				)
				.select()

			if (attachmentsResponse.error) {
				console.log('attachmentsResponse:error', attachmentsResponse)
				return
			}

			const projectAttachmentsResponse = await data.supabase.from('projectAttachments').insert(
				attachmentsResponse.data.map((attachment) => {
					return {
						attachmentId: attachment.id,
						projectId: projectInsertResponse.data[0].id
					}
				})
			)
			if (projectAttachmentsResponse.error) {
				await data.supabase
					.from('attachments')
					.delete()
					.in(
						'id',
						attachmentsResponse.data.map((v) => v.id)
					)
			}

			modal = false
			onFetchProjects()
		} catch (error) {
			console.log('onSubmit', error)
		}
	}

	// Update
	let isUpdating = false
	let updateModal = false
	let currentProject:
		| (TProject & {
				tagList: any[]
		  })
		| {} = {}

	const onInitUpdate = (event: CustomEvent<TProject>) => {
		updateModal = true
		currentProject = {
			...event.detail
			// tagList:
			// 	event.detail.tags?.split(',').map((tag) => {
			// 		return { text: tag, value: tag }
			// 	}) || []
		}
	}

	const onResetUpdate = () => {
		updateModal = false
		currentProject = {}
	}

	const onUpdate = async (event: CustomEvent<typeof currentProject>) => {
		if (!('name' in event.detail)) {
			return
		}

		await data.supabase.rpc('update_sort_order', {
			row_id: event.detail.id,
			sort_order: +event.detail.sortOrder
		})

		isUpdating = true
		const { error } = await data.supabase
			.from('projects')
			.update({
				name: event.detail.name,
				description: event.detail.description,
				previewUrl: event.detail.previewUrl,
				sourceCodeUrl: event.detail.sourceCodeUrl
				// tags: event.detail.tagList
				// 	.map((tag) => {
				// 		return tag.value.toLowerCase()
				// 	})
				// 	.join(',')
			})
			.eq('id', event.detail.id)
		isUpdating = false

		if (error) {
			console.log('onUpdate:error', error)
			return
		}

		onFetchProjects()
		onResetUpdate()
	}

	const onToggleStatus = async (event: CustomEvent<TProject>) => {
		isUpdating = true
		const { error } = await data.supabase
			.from('projects')
			.update({
				status: event.detail.status === 'active' ? 'inactive' : 'active'
			})
			.eq('id', event.detail.id)
		isUpdating = false

		if (error) {
			console.log('onUpdate:error', error)
			return
		}

		onFetchProjects()
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

		<BaseModal bind:value={updateModal} title="Update Project" activator={false}>
			<BaseFormOld
				bind:data={currentProject}
				fields={form.update.fields}
				on:submit={onUpdate}
				on:cancel={onResetUpdate}
			/>
		</BaseModal>
	</div>
	<div class="w-full mt-5 overflow-x-auto">
		<BaseDataTable
			actions
			items={data.projects.data || []}
			headers={[
				{ text: 'Project', value: 'project' },

				{ text: 'Technologies', value: 'technologies' },
				{ text: 'Links', value: 'links' },
				{ text: 'Status', value: 'status' },
				{ text: 'Created', value: 'createdAt' },
				{ text: 'Updated', value: 'updatedAt' }
			]}
			let:item
			let:header
		>
			<div slot="item">
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
					<div class="flex items-center py-2 space-x-4">
						<div class="flex-none">
							<img
								alt={item.projectAttachments[0]?.attachments.name || ''}
								src={src(item.projectAttachments[0]?.attachments.thumbnail)}
								class="object-cover w-12 h-12 rounded"
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
					{item[header.value]}
				{/if}
			</div>

			<div slot="actions">
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
					on:update={onInitUpdate}
					on:status={onToggleStatus}
				/>
			</div>
		</BaseDataTable>
	</div>
</div>

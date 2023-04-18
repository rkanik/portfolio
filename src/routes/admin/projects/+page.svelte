<script lang="ts">
	import BaseDataTable from '$lib/components/base/BaseDataTable.svelte'
	import BaseForm from '$lib/components/base/BaseForm.svelte'
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
			fields,
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
	const supabase = getSupabaseContext()
	const storage = useSupabaseStorage($supabase)

	const onSubmit = async (event: CustomEvent<typeof form.create.data>) => {
		event.preventDefault()
		try {
			const projectInsertResponse = await $supabase
				.from('projects')
				.insert({
					name: event.detail.name,
					description: event.detail.description,
					previewUrl: event.detail.previewUrl,
					sourceCodeUrl: event.detail.sourceCodeUrl,
					tags: event.detail.tagList.map((tag) => tag.value.toLowerCase()).join(',')
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

			const attachmentsResponse = await $supabase
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

			const projectAttachmentsResponse = await $supabase.from('projectAttachments').insert(
				attachmentsResponse.data.map((attachment) => {
					return {
						attachmentId: attachment.id,
						projectId: projectInsertResponse.data[0].id
					}
				})
			)
			if (projectAttachmentsResponse.error) {
				await $supabase
					.from('attachments')
					.delete()
					.in(
						'id',
						attachmentsResponse.data.map((v) => v.id)
					)
			}

			modal = false
			data.projects = await $supabase
				.from('projects')
				.select(`*,projectAttachments(*,attachments(*))`)
				.order('createdAt', { ascending: false })
		} catch (error) {
			console.log('onSubmit', error)
		}
	}

	// List
	const onFetchProjects = async () => {
		data.projects = await $supabase
			.from('projects')
			.select(`*,projectAttachments(*,attachments(*))`)
			.order('createdAt', { ascending: false })
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
			...event.detail,
			tagList:
				event.detail.tags?.split(',').map((tag) => {
					return { text: tag, value: tag }
				}) || []
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

		isUpdating = true
		const { error } = await $supabase
			.from('projects')
			.update({
				name: event.detail.name,
				description: event.detail.description,
				previewUrl: event.detail.previewUrl,
				sourceCodeUrl: event.detail.sourceCodeUrl,
				tags: event.detail.tagList
					.map((tag) => {
						return tag.value.toLowerCase()
					})
					.join(',')
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
		const { error } = await $supabase
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
	<title>Projects | RK Anik</title>
</svelte:head>

<div class="container px-4 py-4 mx-auto md:px-0 md:py-5">
	<div class="flex items-center justify-between py-2">
		<h1 class="text-2xl font-medium">Projects</h1>

		<BaseModal
			bind:value={modal}
			title="Create new project"
			activator={{ class: 'btn btn-sm btn-primary', text: 'New Project' }}
		>
			<BaseForm
				bind:data={form.create.data}
				fields={form.create.fields}
				on:submit={onSubmit}
				on:cancel={() => (modal = false)}
			/>
		</BaseModal>

		<BaseModal bind:value={updateModal} title="Update Project" activator={false}>
			<BaseForm
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

				{ text: 'Tags', value: 'tags' },
				{ text: 'Links', value: 'links' },
				{ text: 'Status', value: 'status' },
				{ text: 'Created', value: 'createdAt' },
				{ text: 'Updated', value: 'updatedAt' }
			]}
			let:item
			let:header
		>
			<div slot="item">
				{#if header.value === 'tags'}
					<div class="flex flex-wrap -ml-1 -mt-1 max-w-xs">
						{#each item.tags.split(',') as tag}
							<div class="badge ml-1 mt-1">{tag}</div>
						{/each}
					</div>
				{:else if header.value === 'project'}
					<div class="flex space-x-4 items-center py-2">
						<div class="flex-none">
							<img
								alt={item.projectAttachments[0]?.attachments.name || ''}
								src={src(item.projectAttachments[0]?.attachments.thumbnail)}
								class="w-12 h-12 object-cover rounded"
							/>
						</div>
						<div>
							<h5 class="text-base font-medium">{item.name}</h5>
							<p class="text-sm opacity-50 max-w-sm max-h-16 overflow-hidden">{item.description}</p>
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
						{ text: 'Update', event: 'update', icon: 'ph:pencil' },
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

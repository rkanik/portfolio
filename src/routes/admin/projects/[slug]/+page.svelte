<script lang="ts">
	import z from 'zod'
	import cn from '$lib/utils/cn'

	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import { getSupabaseContext } from '$lib/store/useSupabase'

	import TextField from '$lib/components/base/TextField.svelte'
	import TextArea from '$lib/components/base/TextArea.svelte'
	import Autocomplete from '$lib/components/base/Autocomplete.svelte'
	import Icon from '@iconify/svelte'
	import { onMount } from 'svelte'
	import AttachmentUploader, {
		type RemoveFunction,
		type UploadFunction
	} from '$lib/components/base/AttachmentUploader.svelte'
	import { resizeImage } from '$lib/utils/resizeImage.js'
	import dataURLtoFile from '$lib/utils/dataURLtoFile.js'
	import useSupabaseStorage, { type SupabaseFile } from '$lib/utils/useSupabaseStorage.js'
	import type { TAttachment, TProjectAttachment } from '$lib/types.js'

	export let data
	const { project, userTechnologies } = data

	const nullableURL = z
		.union([z.string().length(0), z.string().url()])
		.nullable()
		.transform((e) => (!e?.trim() ? null : e))

	const projectSchema = z.object({
		name: z.string().min(1, 'Required.'),
		description: z.string().nullable(),
		previewUrl: nullableURL,
		sourceCodeUrl: nullableURL,
		status: z.boolean().default(false),
		technologies: z.array(
			z.object({
				technologies: z.object({
					id: z.string()
				})
			})
		)
	})

	type TProjectSchema = z.infer<typeof projectSchema>

	const supabase = getSupabaseContext()

	const {
		errors,
		isSubmitting,
		data: values,
		form,
		setIsSubmitting,
		setFields,
		setData
	} = createForm<TProjectSchema>({
		extend: validator({ schema: projectSchema }),
		initialValues: {
			name: project?.name || '',
			description: project?.description || null,
			previewUrl: project?.previewUrl || null,
			sourceCodeUrl: project?.sourceCodeUrl || null,
			status: project?.status === 'active'
		},
		async onSubmit(values, context) {
			if (!project) return

			setIsSubmitting(true)
			const { data, error } = await $supabase
				.from('projects')
				.update({
					name: values.name,
					description: values.description,
					previewUrl: values.previewUrl,
					sourceCodeUrl: values.sourceCodeUrl,
					status: values.status ? 'active' : 'disabled'
				})
				.eq('id', project.id)

			await $supabase
				.from('projectTechnologies')
				.delete()
				.in(
					'technologyId',
					project.projectTechnologies
						.filter((tech) => {
							return !values.technologies.some((item) => {
								return item.technologies.id === tech.technologies.id
							})
						})
						.map((v) => v.technologies.id)
				)
			await $supabase.from('projectTechnologies').insert(
				values.technologies
					.filter((tech) => {
						return !project.projectTechnologies.some((item) => {
							return item.technologies.id === tech.technologies.id
						})
					})
					.map((tech) => ({
						projectId: project.id,
						technologyId: tech.technologies.id
					}))
			)

			setIsSubmitting(false)

			console.log({ data, error })
		}
	})

	const storage = useSupabaseStorage($supabase)

	const onUpload: UploadFunction = async (file) => {
		if (!project) return [new Error('Project not found'), null]

		const base64 = await resizeImage(file, { maxWidth: 3 })
		const file400 = dataURLtoFile(await resizeImage(file, { maxWidth: 400 }), file.name)
		const file1200 = dataURLtoFile(await resizeImage(file, { maxWidth: 1200 }), file.name)

		const [src, thumbnail] = await storage.uploadMany(
			[
				{
					path: 'projects',
					bucket: 'uploads',
					file: file1200
				},
				{
					path: 'projects',
					bucket: 'uploads',
					file: file400
				}
			].filter((v) => v.file) as SupabaseFile[]
		)

		const response = await $supabase
			.from('attachments')
			.insert({
				base64,
				name: file.name,
				mimeType: file.type,
				src: src.data?.path as string,
				thumbnail: thumbnail.data?.path
			})
			.select()

		if (response.error) {
			console.log('response:error', response)
			return [response.error, null]
		}

		const projectAttachmentsResponse = await $supabase
			.from('projectAttachments')
			.insert({
				projectId: project?.id,
				attachmentId: response.data[0].id
			})
			.select('*,attachments(*)')

		if (projectAttachmentsResponse.error) {
			await $supabase
				.from('attachments')
				.delete()
				.in(
					'id',
					response.data.map((v) => v.id)
				)
			return [projectAttachmentsResponse.error, null]
		}

		return [null, projectAttachmentsResponse.data[0].attachments as TAttachment]
	}

	const onRemoveAttachment: RemoveFunction = async (attachment) => {
		const { error: storageError } = await storage.remove(
			[attachment.src, attachment.thumbnail].filter(Boolean).map((v) => `uploads/${v}`)
		)
		if (storageError) {
			return {
				data: null,
				error: new Error('Error while removing attachments from Storage.')
			}
		}

		const { error: databaseError } = await $supabase
			.from('attachments')
			.delete()
			.eq('id', attachment.id)

		if (databaseError) {
			return {
				data: null,
				error: new Error('Error while removing attachments from the database.')
			}
		}

		return {
			error: null,
			data: attachment
		}
	}

	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

<div class="w-full max-w-4xl py-16 mx-auto">
	<form use:form class="flex flex-col space-y-2">
		<AttachmentUploader
			upload={onUpload}
			remove={onRemoveAttachment}
			attachments={project?.projectAttachments.map((item) => item.attachments) || []}
		/>

		<TextField
			required
			name="name"
			label="Project Name"
			placeholder="Enter project name"
			errors={$errors.name || []}
		/>
		<TextArea
			name="description"
			label="Description"
			placeholder="Briefly explain the project."
			errors={$errors.description || []}
		/>
		<TextField
			name="previewUrl"
			label="Preview URL"
			placeholder="Preview url.."
			errors={$errors.previewUrl || []}
		/>
		<TextField
			name="sourceCodeUrl"
			label="Source Code URL"
			placeholder="Preview url.."
			errors={$errors.sourceCodeUrl || []}
		/>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<Autocomplete
			name="technologies"
			options={userTechnologies}
			optionText="technologies.name"
			optionValue="technologies.id"
			label="Tolls and Technologies"
			placeholder="Select tools and technologies..."
			value={project?.projectTechnologies || []}
			on:change={(e) => setFields('technologies', e.detail)}
		>
			<svelte:fragment slot="selection" let:item let:remove>
				{#if mounted}
					<button class="flex items-center mt-1 ml-1 space-x-2 normal-case rounded-full btn btn-sm">
						<Icon icon={item.technologies.icon} class="text-sm" />
						<span>{item.technologies.name}</span>
						<button on:click={remove}>
							<Icon icon="iconamoon:sign-times-circle-fill" />
						</button>
					</button>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="item" let:item let:selected let:focused let:onClick>
				<li on:click={onClick}>
					<span
						class={cn('rounded-lg', {
							'bg-black bg-opacity-20': focused,
							'bg-purple-500 bg-opacity-10 text-white': selected
						})}
					>
						<Icon icon={item.technologies.icon} class="text-lg" />
						<span class="text-base font-medium">{item.technologies.name}</span>
					</span>
				</li>
			</svelte:fragment>
		</Autocomplete>

		<div class="mt-4 form-control">
			<label class="cursor-pointer label">
				<span class="flex flex-col label-text">
					<span class="text-base font-medium">Status</span>
					<span class="text-sm opacity-70">
						Enable or disable the project. If disabled it will not be publicly visible.
					</span>
				</span>
				<input
					name="status"
					type="checkbox"
					class={cn('toggle border-solid', { 'toggle-success': $values.status })}
				/>
			</label>
		</div>

		<div class="mt-4">
			<button type="submit" class={cn('btn btn-primary', { loading: $isSubmitting })}>Save</button>
		</div>
	</form>
</div>

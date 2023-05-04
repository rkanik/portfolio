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
	import AttachmentUploader from '$lib/components/base/AttachmentUploader.svelte'

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

	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

<div class="w-full max-w-4xl mx-auto py-16">
	<form use:form class="flex flex-col space-y-2">
		<AttachmentUploader
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
					<button class="btn btn-sm mt-1 ml-1 rounded-full flex items-center space-x-2 normal-case">
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

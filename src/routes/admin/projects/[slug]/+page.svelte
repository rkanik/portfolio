<script lang="ts">
	import z from 'zod'
	import cn from '$lib/utils/cn'

	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import { getSupabaseContext } from '$lib/store/useSupabase'

	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import TextField from '$lib/components/base/TextField.svelte'
	import TextArea from '$lib/components/base/TextArea.svelte'

	export let data
	const { project } = data

	const nullableURL = z
		.union([z.string().length(0), z.string().url()])
		.nullable()
		.transform((e) => (!e?.trim() ? null : e))

	const projectSchema = z.object({
		name: z.string().min(1, 'Required.'),
		description: z.string().nullable(),
		previewUrl: nullableURL,
		sourceCodeUrl: nullableURL,
		status: z.boolean().default(false)
	})

	type TProjectSchema = z.infer<typeof projectSchema>

	const supabase = getSupabaseContext()

	const {
		errors,
		isSubmitting,
		data: values,
		form,
		setIsSubmitting
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
			setIsSubmitting(false)

			console.log({ data, error })
		}
	})

	$: {
		console.log($values)
	}
</script>

<div class="w-full max-w-4xl mx-auto">
	<form use:form>
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

<script lang="ts">
	import type { Maybe, TProject } from '$lib/types'

	import { createForm } from 'felte'
	import { goto } from '$app/navigation'
	import { validator } from '@felte/validator-zod'

	import z from 'zod'
	import slugify from 'slugify'

	import BaseForm from '$lib/components/base/BaseForm.svelte'
	import { useGlobalPageData } from '$lib/utils/useGlobalPageData'
	import { page } from '$app/stores'
	import { invalidateProjectsQuery } from '$lib/queries/createProjectsQuery'

	export let project: TProject
	const { supabase } = useGlobalPageData()

	const basicSchema = z.object({
		name: z.string().min(1, 'Required.'),
		slug: z.string().min(1, 'Required.'),
		description: z.string().nullable(),
		status: z.boolean().default(false)
	})

	type TBasic = z.infer<typeof basicSchema>

	const toBasic = (v: Maybe<TProject>): TBasic => {
		return {
			name: v?.name || '',
			slug: v?.slug || '',
			status: v?.status === 'active',
			description: v?.description || null
		}
	}

	const basicForm = createForm<z.infer<typeof basicSchema>>({
		initialValues: toBasic(project),
		extend: validator({
			schema: basicSchema
		}),
		async onSubmit(values) {
			if (!project) return

			const oldSlug = project.slug

			basicForm.setIsSubmitting(true)
			const { error, data: basicProject } = await supabase
				.from('projects')
				.update({
					name: values.name,
					slug: values.slug,
					description: values.description,
					status: values.status ? 'active' : 'disabled'
				})
				.eq('id', project.id)
				.select('name,slug,description,status')
				.single()
			basicForm.setIsSubmitting(false)

			if (error) {
				console.log('onSubmit:basicForm', { error })
				return
			}

			invalidateProjectsQuery()
			project = {
				...project,
				...basicProject
			}

			if (oldSlug !== project.slug) {
				goto(`/admin/projects/${project.slug}`)
			}
		}
	})

	const { data: basicValues, isSubmitting: basicIsSubmitting } = basicForm
	$: {
		basicForm.setFields('slug', slugify($basicValues.name, { lower: true }))
	}

	$: {
		Object.entries(toBasic(project)).forEach(([k, v]) => {
			basicForm.setFields(k as any, v, true)
		})
	}
</script>

<BaseForm
	class="mt-8"
	form={basicForm}
	hideCancelButton
	submitButtonText="Save Changes"
	loading={$basicIsSubmitting}
	actionsClass="mt-8 col-span-12"
	fields={[
		{
			type: 'text',
			name: 'name',
			required: true,
			label: 'Project Name',
			class: 'col-span-12',
			placeholder: 'Enter project name'
		},
		{
			type: 'text',
			name: 'slug',
			label: 'Slug',
			disabled: true,
			required: true,
			class: 'col-span-12'
		},
		{
			type: 'textarea',
			name: 'description',
			label: 'Description',
			class: 'col-span-12',
			placeholder: 'Briefly explain the project...'
		}
	]}
>
	<svelte:fragment slot="bottom">
		<div class="col-span-12">
			<label class="cursor-pointer label mt-4">
				<span class="flex flex-col label-text">
					<span class="text-base font-medium">Status</span>
					<span class="text-sm opacity-70">
						Enable or disable the project. If disabled it will not be publicly visible.
					</span>
				</span>
				<input
					name="status"
					type="checkbox"
					class="toggle border-solid"
					class:toggle-success={$basicValues.status}
				/>
			</label>
		</div>
	</svelte:fragment>
</BaseForm>

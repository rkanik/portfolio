<script lang="ts">
	import type { Maybe, TProject } from '$lib/types'

	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import { useGlobalPageData } from '$lib/utils/useGlobalPageData'

	import z from 'zod'
	import BaseIFrame from '../base/BaseIFrame.svelte'
	import BaseForm from '$lib/components/base/BaseForm.svelte'

	export let project: TProject
	const { supabase } = useGlobalPageData()

	const nullableURL = z
		.union([z.string().length(0), z.string().url()])
		.nullable()
		.transform((e) => (!e?.trim() ? null : e))

	const previewSchema = z.object({
		previewUrl: nullableURL
	})

	type TPreviewSchema = z.infer<typeof previewSchema>

	const toInitialValues = (v: Maybe<TProject>): TPreviewSchema => {
		return {
			previewUrl: v?.previewUrl ?? null
		}
	}

	const previewForm = createForm<z.infer<typeof previewSchema>>({
		initialValues: toInitialValues(project),
		extend: validator({
			schema: previewSchema
		}),
		async onSubmit(values) {
			if (!project) return

			previewForm.setIsSubmitting(true)
			const { error, data: basicProject } = await supabase
				.from('projects')
				.update({
					previewUrl: values.previewUrl
				})
				.eq('id', project.id)
				.select('previewUrl')
				.single()
			previewForm.setIsSubmitting(false)

			if (error) {
				console.log('onSubmit:previewForm', { error })
				return
			}

			project = {
				...project,
				...basicProject
			}
		}
	})

	const { data: basicValues, isSubmitting: basicIsSubmitting } = previewForm
</script>

<BaseForm
	hideCancelButton
	form={previewForm}
	class={$$props.class}
	loading={$basicIsSubmitting}
	submitButtonText="Save Changes"
	actionsClass="mt-8 col-span-12"
	fields={[
		{
			type: 'text',
			name: 'previewUrl',
			label: 'Preview URL',
			class: 'col-span-12',
			placeholder: 'Enter the website url if have any...'
		}
	]}
>
	<svelte:fragment slot="bottom">
		{#if $basicValues.previewUrl}
			<BaseIFrame
				height={700}
				width={1366}
				initialScale={0.65}
				title={project.name}
				src={$basicValues.previewUrl}
				class="col-span-12 mt-4"
			/>
		{/if}
	</svelte:fragment>
</BaseForm>

<script lang="ts">
	import type { Maybe, TTestimonial } from '$lib/types'

	import { createForm } from 'felte'
	import { createEventDispatcher } from 'svelte'
	import { validator } from '@felte/validator-zod'
	import { useTestimonialModule, type CreateSchema } from '$lib/modules/testimonial'

	import BaseForm from '../base/BaseForm.svelte'
	import { anonymous } from '$lib/const'

	export let value: Maybe<TTestimonial> = undefined
	export let onClose = anonymous

	let loading = false

	let isUpdate = false
	$: isUpdate = !!(value && value.id)

	const dispatch = createEventDispatcher()

	const Testimonial = useTestimonialModule()

	const toInitialValues = (v: Maybe<TTestimonial>) => {
		return {
			name: v?.name || '',
			company: v?.company || '',
			testimonial: v?.testimonial || '',
			rating: v?.rating || 0,
			date: v?.date ? new Date(v.date) : null,
			avatar: v?.avatar?.id
		}
	}

	const form = createForm<CreateSchema>({
		initialValues: toInitialValues(value),
		extend: validator({ schema: Testimonial.createSchema }),
		async onSubmit(values) {
			loading = true

			const res = await (isUpdate
				? Testimonial.update((value as TTestimonial).id, values)
				: Testimonial.create(values))

			loading = false

			if (res.error) {
				console.log('Testimonial.create', res.error.message)
				return
			}
			form.reset()

			dispatch(isUpdate ? 'updated' : 'created', res.data)
		}
	})

	// const { data } = form
	// $: {
	// 	console.log({ $data })
	// }
</script>

<BaseForm
	{form}
	{loading}
	{onClose}
	fields={[
		{
			type: 'avatar',
			name: 'avatar',
			label: 'Avatar',
			class: 'col-span-2',
			attachment: value?.avatar
		},
		{
			type: 'text',
			name: 'name',
			label: 'Name',
			required: true,
			class: 'col-span-10',
			placeholder: 'Enter Name'
		},
		{
			type: 'text',
			name: 'company',
			label: 'Company',
			placeholder: 'Enter company name',
			class: 'col-span-12'
		},
		{ type: 'rating', required: true, name: 'rating', label: 'Rating', class: 'col-span-6 pr-1' },
		{
			type: 'date',
			name: 'date',
			label: 'Date',
			class: 'col-span-6 pl-1',
			placeholder: 'Pick a date'
		},
		{
			required: true,
			type: 'textarea',
			name: 'testimonial',
			label: 'Testimonial',
			placeholder: 'Write the testimonial feedback here...',
			class: 'col-span-12'
		}
	]}
/>

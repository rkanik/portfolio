<script lang="ts">
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import { useContextStoreContext } from '$lib/store/useContextStore'
	import { useTestimonialModule, type CreateSchema } from '$lib/modules/testimonial'

	import BaseForm from '../base/BaseForm.svelte'
	import { createEventDispatcher } from 'svelte'

	let loading = false

	const dispatch = createEventDispatcher()
	const context = useContextStoreContext()
	const Testimonial = useTestimonialModule($context)

	const form = createForm<CreateSchema>({
		initialValues: {
			name: '',
			company: '',
			testimonial: '',
			date: null,
			avatar: {
				src: null,
				file: null
			}
		},
		extend: validator({ schema: Testimonial.createSchema }),
		async onSubmit(values) {
			loading = true
			const res = await Testimonial.create(values)
			loading = false

			if (res.error) {
				console.log('Testimonial.create', res.error.message)
				return
			}
			form.reset()
			dispatch('created', res.data)
		}
	})

	const { data: values } = form
	$: {
		console.log($values)
	}
</script>

<BaseForm
	{form}
	{loading}
	fields={[
		{
			type: 'avatar',
			name: 'avatar',
			label: 'Avatar',
			class: 'col-span-2'
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
			required: true,
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

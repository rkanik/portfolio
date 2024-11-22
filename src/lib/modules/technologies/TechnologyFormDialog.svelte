<script lang="ts">
	import type { TTechnology } from '@/lib/types'
	import type { SuperValidated } from 'sveltekit-superforms'
	import type { TZPostTechnology } from './zod'
	import { zPostTechnology } from './zod'
	import { createEventDispatcher } from 'svelte'
	import { superForm as createSuperForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	//

	import BaseDialog from '@base/base-dialog'
	import { Button } from '@ui/button'
	import BaseFormField from '@/lib/components/base/base-form-field'
	import { Form, FormButton } from '@/lib/components/ui/form'
	import { Input } from '@/lib/components/ui/input'

	const dispatch = createEventDispatcher()

	export let open = false
	export let onOpenChange = (v: boolean) => {
		open = v
	}

	export let initialForm: SuperValidated<TZPostTechnology>
	export let initialData: TTechnology | undefined

	const form = createSuperForm(initialForm, {
		resetForm: false,
		validators: zodClient(zPostTechnology),
		onResult({ result }) {
			if (result.type === 'success') {
				open = false
				form.reset()
				return dispatch('success', result.data)
			}
			console.log('onResult', result)
		},
	})

	const { form: fd, enhance, submitting } = form

	$: {
		form.reset({
			data: {
				id: initialData?.id,
				name: initialData?.name || '',
				icon: initialData?.icon || '',
				color: initialData?.color || '',
			},
		})
	}
</script>

<BaseDialog
	{open}
	wrapper={Form}
	{onOpenChange}
	title="Add New Technology"
	wrapperProps={{
		enhance,
		action: '?/post',
	}}
>
	<Button slot="trigger" let:builder builders={[builder]}>
		Add Technology
	</Button>

	<!--  -->
	<div class="grid grid-cols-1 gap-4">
		<BaseFormField {form} name="id" let:attrs>
			<input type="hidden" {...attrs} bind:value={$fd.id} />
		</BaseFormField>
		<BaseFormField {form} name="name" label="Name" let:attrs>
			<Input {...attrs} bind:value={$fd.name} />
		</BaseFormField>
		<BaseFormField {form} name="icon" label="Icon" let:attrs>
			<Input {...attrs} bind:value={$fd.icon} />
		</BaseFormField>
		<BaseFormField {form} name="color" label="Color" let:attrs>
			<Input {...attrs} bind:value={$fd.color} />
		</BaseFormField>
	</div>

	<!--  -->
	<div slot="footer">
		<FormButton disabled={$submitting}>Submit</FormButton>
	</div>
</BaseDialog>

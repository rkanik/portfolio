<script lang="ts">
	import { zPostProject } from './schema'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import BaseDataTable from '@base/base-data-table'
	import BaseDialog from '@base/base-dialog'
	import BaseFormField from '@base/base-form-field'
	import { Button } from '@ui/button'
	import { Form, FormButton } from '@ui/form'
	import { Input } from '@ui/input'

	let dialog = false

	export let data

	const form = superForm(data.form, {
		resetForm: false,
		validators: zodClient(zPostProject),
		onResult({ result }) {
			console.log('onResult', result)
		},
	})

	const { form: fd, enhance, submitting } = form
</script>

<div class="p-4">
	<BaseDialog
		open={dialog}
		title="Create Project"
		description="Create a new project"
		wrapper={Form}
		wrapperProps={{
			enhance,
			action: '?/post',
		}}
	>
		<Button slot="trigger" let:builder builders={[builder]}>
			Open Dialog
		</Button>
		<div class="grid grid-cols-2 gap-4">
			<BaseFormField
				{form}
				name="username"
				label="Project Name"
				let:attrs
				class="col-span-2"
			>
				<Input {...attrs} bind:value={$fd.username} />
			</BaseFormField>
			<BaseFormField
				{form}
				name="username"
				label="Description"
				let:attrs
				class="col-span-2"
			>
				<Input {...attrs} bind:value={$fd.username} />
			</BaseFormField>
		</div>
		<div slot="footer">
			<FormButton disabled={$submitting}>Submit</FormButton>
		</div>
	</BaseDialog>
	<BaseDataTable />
</div>

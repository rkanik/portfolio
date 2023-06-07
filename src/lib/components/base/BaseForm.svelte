<script lang="ts" context="module">
	import type { createForm } from 'felte'

	type TForm = ReturnType<typeof createForm<any>>

	type TBaseField = {
		name: string
		class?: string
		label?: string
		required?: boolean
	}

	type TTextField = TBaseField & {
		type: 'text' | 'email' | 'password' | 'tel'
		placeholder?: string
	}

	type TDateField = TBaseField & {
		type: 'date'
		value?: Maybe<Date>
		placeholder?: string
	}

	type TRatingField = TBaseField & {
		type: 'rating'
	}

	type TTextAreaField = TBaseField & {
		type: 'textarea'
		placeholder?: string
	}

	type TAvatarField = TBaseField & {
		type: 'avatar'
		attachment?: Maybe<TAttachment>
	}

	export type TField = TTextField | TDateField | TRatingField | TTextAreaField | TAvatarField
</script>

<script lang="ts">
	import Rating from './Rating.svelte'
	import TextArea from './TextArea.svelte'
	import TextField from './TextField.svelte'
	import DatePicker from './DatePicker.svelte'
	import AvatarPicker from './AvatarPicker.svelte'
	import { anonymous } from '$lib/const'
	import type { Maybe, TAttachment } from '$lib/types'

	export let form: TForm
	export let fields: TField[] = []
	export let loading: boolean = false
	export let onClose = anonymous

	const { errors, form: useForm, data: values } = form
</script>

<form use:useForm class="grid grid-cols-12 gap-1">
	{#each fields as field}
		{@const props = {
			name: field.name,
			label: field.label,
			required: field.required,
			class: field.class || 'col-span-12',
			errors: $errors[field.name] || []
		}}
		{#if field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'tel'}
			<TextField {...props} placeholder={field.placeholder} />
		{/if}
		{#if field.type === 'textarea'}
			<TextArea {...props} placeholder={field.placeholder} />
		{/if}
		{#if field.type === 'date'}
			<DatePicker
				{...props}
				value={$values[field.name]}
				setFields={form.setFields}
				placeholder={field.placeholder}
			/>
		{/if}
		{#if field.type === 'rating'}
			<Rating {...props} setFields={form.setFields} value={$values[field.name]} />
		{/if}
		{#if field.type === 'avatar'}
			<AvatarPicker
				{...props}
				attachment={field.attachment}
				setFields={form.setFields}
				value={$values[field.name]}
			/>
		{/if}
	{/each}
	<div class="col-span-12 flex items-center justify-end space-x-2 mt-3">
		<button type="button" class="btn btn-ghost normal-case" on:click={onClose}>Cancel</button>
		<button type="submit" class="btn btn-primary normal-case px-8" class:loading> Save </button>
	</div>
</form>

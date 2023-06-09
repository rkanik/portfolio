<script lang="ts" context="module">
	import type { createForm } from 'felte'

	export type TForm = ReturnType<typeof createForm<any>>

	export type TBaseField = {
		name: string
		class?: string
		label?: string
		disabled?: boolean
		required?: boolean
	}

	export type TTextField = TBaseField & {
		type: 'text' | 'number' | 'tel' | 'email' | 'password'
		placeholder?: string
	}

	export type TDateField = TBaseField & {
		type: 'date'
		value?: Maybe<Date>
		placeholder?: string
	}

	export type TRatingField = TBaseField & {
		type: 'rating'
	}

	export type TTextAreaField = TBaseField & {
		type: 'textarea'
		placeholder?: string
	}

	export type TAvatarField = TBaseField & {
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

	export let showActions = true
	export let actionsClass = 'col-span-12 flex items-center justify-end space-x-2 mt-4'

	export let hideCancelButton = false
	export let cancelButtonText = 'Cancel'
	export let cancelButtonClass = 'btn btn-ghost normal-case'

	export let hideSubmitButton = false
	export let submitButtonText = 'Submit'
	export let submitButtonClass = 'btn btn-primary normal-case px-8'

	const { errors, form: useForm, data: values } = form
</script>

<form use:useForm class="grid grid-cols-12 gap-1 {$$props.class || ''}">
	<slot name="top" />
	{#each fields as field}
		{@const props = {
			name: field.name,
			label: field.label,
			required: field.required,
			disabled: field.disabled,
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
	<slot name="bottom" />

	{#if showActions}
		<div class={actionsClass}>
			{#if !hideCancelButton}
				<button type="button" class={cancelButtonClass} on:click={onClose}>
					{cancelButtonText}
				</button>
			{/if}
			{#if !hideSubmitButton}
				<button type="submit" class={submitButtonClass} class:loading>
					{submitButtonText}
				</button>
			{/if}
		</div>
	{/if}
</form>

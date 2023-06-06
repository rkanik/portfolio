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
		{#if field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'tel'}
			<TextField
				name={field.name}
				label={field.label}
				required={field.required}
				placeholder={field.placeholder}
				class={field.class || 'col-span-12'}
				errors={$errors[field.name] || []}
			/>
		{/if}
		{#if field.type === 'textarea'}
			<TextArea
				name={field.name}
				label={field.label}
				required={field.required}
				placeholder={field.placeholder}
				class={field.class || 'col-span-12'}
				errors={$errors[field.name] || []}
			/>
		{/if}
		{#if field.type === 'date'}
			<DatePicker
				name={field.name}
				label={field.label}
				required={field.required}
				setFields={form.setFields}
				placeholder={field.placeholder}
				class={field.class || 'col-span-12'}
				errors={$errors[field.name] || []}
			/>
		{/if}
		{#if field.type === 'rating'}
			<Rating
				name={field.name}
				label={field.label}
				required={field.required}
				setFields={form.setFields}
				class={field.class || 'col-span-12'}
				value={$values[field.name]}
				errors={$errors[field.name] || []}
			/>
		{/if}
		{#if field.type === 'avatar'}
			<AvatarPicker
				name={field.name}
				label={field.label}
				attachment={field.attachment}
				required={field.required}
				setFields={form.setFields}
				class={field.class || 'col-span-12'}
				value={$values[field.name]}
				errors={$errors[field.name] || []}
			/>
		{/if}
	{/each}
	<div class="col-span-12 flex items-center justify-end space-x-2 mt-3">
		<button type="button" class="btn btn-ghost normal-case" on:click={onClose}>Cancel</button>
		<button type="submit" class="btn btn-primary normal-case px-8" class:loading> Save </button>
	</div>
</form>

<script lang="ts">
	import cn from '$lib/utils/cn'

	import { onMount } from 'svelte'
	import { DateInput } from 'date-picker-svelte'
	import type { Maybe } from '$lib/types'

	export let name: string
	export let setFields: any

	export let label: string = ''
	export let errors: string[] = []
	export let placeholder: string = ''
	export let required: boolean = false
	export let id = Math.random().toString(36).slice(-10)

	let element: HTMLDivElement
	let inputElement: HTMLInputElement | null

	onMount(() => {
		inputElement = element.querySelector('input')

		inputElement?.setAttribute('readonly', 'true')
		inputElement?.setAttribute('class', 'input w-full input-bordered border-solid')
	})

	export let value: Maybe<Date> = null
	let innerValue: Maybe<Date> = value

	$: {
		setFields(name, innerValue)
	}
</script>

<div bind:this={element} class={cn('form-control', $$props.class)}>
	{#if label}
		<label for={id} class="label">
			<span class="label-text">
				{label}
				{#if required}
					<span class="text-red-500">*</span>
				{/if}
			</span>
		</label>
	{/if}
	<DateInput bind:value={innerValue} {placeholder} format="dd-MM-yyyy" />
	{#if errors.length > 0}
		<label for={id} class="label">
			<span class="label-text-alt text-error">
				{errors.toString()}
			</span>
		</label>
	{/if}
</div>

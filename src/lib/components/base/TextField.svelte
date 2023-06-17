<script lang="ts">
	import cn from '$lib/utils/cn'

	export let disabled: boolean = false
	export let required: boolean = false
	export let errors: string[] = []
	export let label: string = ''
	export let placeholder: string = ''
	export let name: string
	export let value: unknown = ''
	export let type: 'text' | 'number' | 'tel' | 'email' | 'password' = 'text'
	export let id = Math.random().toString(36).slice(-10)
	export let inputClass = ''
	const onInput = (e: any) => {
		value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value
	}
</script>

<div class={cn('form-control', $$props.class)}>
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
	<input
		{id}
		{type}
		{name}
		{value}
		{disabled}
		{placeholder}
		class={cn('input input-bordered border-solid bg-transparent', inputClass, {
			'input-error': errors.length > 0
		})}
		on:input={onInput}
	/>
	{#if errors.length > 0}
		<label for={id} class="label">
			<span class="label-text-alt text-error">
				{errors.toString()}
			</span>
		</label>
	{/if}
</div>

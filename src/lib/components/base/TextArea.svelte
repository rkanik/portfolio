<script lang="ts">
	import cn from '$lib/utils/cn'

	export let required: boolean = false
	export let errors: string[] = []
	export let label: string = ''
	export let placeholder: string = ''
	export let name: string
	export let id = Math.random().toString(36).slice(-10)
	export let rows: number = 3
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
	<textarea
		{id}
		{name}
		{rows}
		{placeholder}
		class={cn('textarea textarea-bordered border-solid bg-transparent', {
			'textarea-error': errors.length > 0
		})}
	/>
	{#if errors.length > 0}
		<label for={id} class="label">
			<span class="label-text-alt text-error">
				{errors.toString()}
			</span>
		</label>
	{/if}
</div>

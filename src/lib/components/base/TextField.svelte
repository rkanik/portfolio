<script lang="ts">
	import cn from '$lib/utils/cn'

	export let required: boolean = false
	export let errors: string[] = []
	export let label: string = ''
	export let placeholder: string = ''
	export let name: string
	export let type: 'text' | 'number' | 'tel' = 'text'
	export let id = Math.random().toString(36).slice(-10)
</script>

<div class="form-control">
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
		{placeholder}
		class={cn('input input-bordered border-solid', {
			'input-error': errors.length > 0
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

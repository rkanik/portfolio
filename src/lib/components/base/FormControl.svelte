<script lang="ts">
	import cn from '$lib/utils/cn'

	export let id: string

	export let errors: string[] = []
	export let required: boolean = false

	export let label: string = ''
	export let labelClass = ''
</script>

<div {...$$restProps} class={cn('form-control', $$props.class)}>
	{#if label}
		<label for={id} class={cn('label', labelClass)}>
			<span class="label-text">
				{label}
				{#if required}
					<span class="text-red-500">*</span>
				{/if}
			</span>
		</label>
	{/if}
	<slot attrs={{ id }} />
	{#if errors.length > 0}
		<label for={id} class="label">
			<span class="label-text-alt text-error">
				{errors.toString()}
			</span>
		</label>
	{/if}
</div>

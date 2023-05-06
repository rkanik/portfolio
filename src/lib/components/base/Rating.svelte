<script lang="ts">
	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	export let name: string
	export let value: number
	export let setFields: any

	export let label: string = ''
	export let errors: string[] = []
	export let required: boolean = false
	export let id = Math.random().toString(36).slice(-10)
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
	<div
		class={cn(
			'border rounded-lg w-full h-12 flex items-center px-2',
			errors.length > 0 ? 'border-error' : 'border-white border-opacity-20'
		)}
	>
		<input {name} type="number" class="hidden" />
		<div class="flex space-x-1">
			{#each [...Array(5).keys()] as index}
				<button
					type="button"
					on:click={() => {
						setFields(name, index + 1)
					}}
				>
					<Icon
						icon={value > index ? 'ic:outline-star' : 'ic:outline-star-border'}
						class={cn('text-3xl', value > index ? 'text-orange-400' : '')}
					/>
				</button>
			{/each}
		</div>
	</div>
	{#if errors.length > 0}
		<label for={id} class="label">
			<span class="label-text-alt text-error">
				{errors.toString()}
			</span>
		</label>
	{/if}
</div>

<script lang="ts">
	import cn from '$lib/utils/cn'

	export let type: 'text' | 'number' | 'tel' | 'email' | 'password' = 'text'
	export let id: string
	export let disabled: boolean = false
	export let placeholder: string = ''

	export let errors: string[] = []

	export let value: string | number = ''
	const onInput = (e: any) => {
		value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value
	}
</script>

<input
	{...{ id, type, value, disabled, placeholder, name: id }}
	class={cn('input input-bordered border-solid', $$props.class, {
		'input-error': errors.length > 0
	})}
	on:input={onInput}
/>

<script lang="ts" context="module">
	import type { FormPath, SuperForm } from 'sveltekit-superforms'
</script>

<script
	lang="ts"
	generics="T extends Record<string, unknown>, N extends FormPath<T>"
>
	import {
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel,
	} from '@ui/form'

	export let form: SuperForm<T>
	export let name: N
	export let label = ''
	export let description = ''
</script>

<FormField {form} {name} {...$$restProps}>
	<FormControl id={name} let:attrs>
		{#if label}
			<FormLabel>{label}</FormLabel>
		{/if}
		<slot {attrs} />
	</FormControl>
	{#if description}
		<FormDescription>{description}</FormDescription>
	{/if}
	<FormFieldErrors />
</FormField>

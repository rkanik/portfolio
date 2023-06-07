<script lang="ts">
	import type { Maybe, TAttachment } from '$lib/types'
	import type { OnSelectHandlerSingle } from '../StorageManager2.svelte'

	import { getPublicUrl } from '$lib/utils/getPublicUrl.js'

	import cn from '$lib/utils/cn'
	import StoragePicker from '../StoragePicker.svelte'

	export let name: string
	export let value: string
	export let setFields: any

	export let label: string = ''
	export let errors: string[] = []
	export let required: boolean = false
	export let id = Math.random().toString(36).slice(-10)
	export let attachment: Maybe<TAttachment> = undefined

	const onSelect: OnSelectHandlerSingle = (v, { reset }) => {
		attachment = v
		setFields(name, v.id)
		reset()
	}

	let modal = false
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

	<StoragePicker bind:modal selected={[value].filter(Boolean)} {onSelect} multiple={false}>
		<button type="button" class="avatar" on:click={() => (modal = true)}>
			<div class="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
				<img src={getPublicUrl(attachment)} alt="testimonial avatar" />
			</div>
		</button>
	</StoragePicker>

	{#if errors.length > 0}
		<label for={id} class="label">
			<span class="label-text-alt text-error">
				{errors.toString()}
			</span>
		</label>
	{/if}
</div>

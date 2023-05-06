<script lang="ts">
	import cn from '$lib/utils/cn'
	import src from '$lib/utils/src'

	export let value: {
		src?: string
		file?: File
	}
	export let name: string
	export let setFields: any

	export let label: string = ''
	export let errors: string[] = []
	export let required: boolean = false
	export let id = Math.random().toString(36).slice(-10)

	const onInput = (e: any) => {
		setFields(name, {
			file: e.target.files[0],
			src: URL.createObjectURL(e.target.files[0])
		})
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
	<div class="avatar">
		<input
			type="file"
			id="avatar"
			accept="images/*"
			class="opacity-0 absolute inset-0"
			on:input={onInput}
		/>
		<div class="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
			<img src={src(value.src)} alt="testimonial avatar" />
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

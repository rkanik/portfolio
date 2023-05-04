<script lang="ts">
	import src from '$lib/utils/src'
	import type { TAttachment } from '$lib/types'
	import Icon from '@iconify/svelte'

	type Attachment = TAttachment & { file?: File }

	export let attachments: Attachment[] = []
	const initialAttachments = [...attachments]

	let inputElement: HTMLInputElement

	const onFileList = (files: FileList | File[]) => {
		files = [...files].filter((file) => {
			return !attachments.some((attachment) => {
				return attachment.file?.name === file.name
			})
		})
		attachments = [
			...attachments,
			...files.map((file) => {
				const src = URL.createObjectURL(file)
				return {
					src,
					file,
					id: 'new',
					thumbnail: src,
					name: file.name,
					mimeType: file.type,
					base64: null,
					createdAt: null,
					updatedAt: null
				}
			})
		]
	}

	const onChangeInput = (e: any) => {
		onFileList(e.target.files as FileList)
	}
	const openFilePicker = () => {
		inputElement.click()
	}

	const remove = (index: number) => () => {
		attachments = attachments.filter((_, i) => index !== i)
	}

	const reset = () => {
		attachments = [...initialAttachments]
	}

	let isDirty = false
	$: {
		isDirty =
			attachments.some((v) => v.id === 'new') || attachments.length !== initialAttachments.length
	}

	// Dropzone
	let isHighlighted = false
	const highlight = () => {
		if (!isHighlighted) {
			isHighlighted = true
		}
	}
	const unHighlight = () => {
		if (isHighlighted) {
			isHighlighted = false
		}
	}
	const drop = (e: any) => {
		onFileList(e.dataTransfer.files as FileList)
		unHighlight()
	}
</script>

<div
	class="bg-base-100 p-4 rounded-xl shadow-xl relative"
	on:dragenter|preventDefault|stopPropagation={highlight}
>
	{#if isHighlighted}
		<div
			class="absolute inset-0 bg-primary bg-opacity-20 border-2 border-primary border-dashed z-10 rounded-xl flex flex-col items-center justify-center space-y-4 transition-all backdrop-blur"
			on:dragover|preventDefault|stopPropagation={highlight}
			on:drop|preventDefault|stopPropagation={drop}
			on:dragleave|preventDefault|stopPropagation={unHighlight}
		>
			<Icon icon="ci:files" class="text-7xl text-white pointer-events-none" />
			<div class="text-xl font-bold text-white pointer-events-none">Drag and drop files here</div>
		</div>
	{/if}
	<input
		bind:this={inputElement}
		type="file"
		class="hidden"
		multiple
		accept="images/*"
		on:change={onChangeInput}
	/>
	<div class="flex items-center justify-between">
		<div class="text-lg font-medium">Attachments</div>
		{#if isDirty}
			<div class="flex items-center space-x-2">
				<button class="btn btn-outline btn-sm normal-case btn-error" on:click={reset}>Reset</button>
				<button class="btn btn-sm btn-primary normal-case" on:click={reset}>Save</button>
			</div>
		{/if}
	</div>
	<div class="grid grid-cols-3 gap-4 mt-4">
		{#each attachments as attachment, index}
			<div class="h-64 relative">
				{#if attachment.id === 'new'}
					<div class="badge badge-primary absolute top-1 right-1">New</div>
				{/if}
				<img
					alt={attachment.name}
					src={src(attachment.thumbnail)}
					class="h-full w-full object-cover object-center rounded-xl"
				/>
				<button
					class="btn btn-circle btn-sm btn-error absolute bottom-1 right-1"
					on:click={remove(index)}
				>
					<Icon icon="ic:outline-delete" class="text-lg" />
				</button>
			</div>
		{/each}
		<button
			class="h-64 bg-base-300 grid place-items-center rounded-xl hover:bg-base-200"
			on:click={openFilePicker}
		>
			<Icon icon="material-symbols:add" class="text-7xl opacity-50" />
		</button>
	</div>
</div>

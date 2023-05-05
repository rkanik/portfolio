<script lang="ts" context="module">
	type InnerAttachment = TAttachment & {
		file?: File
		localId?: string
		error?: Error | PostgrestError | null
		isLoading: boolean
	}
	export type UploadFunction = (
		file: File
	) => Promise<[Error | PostgrestError, null] | [null, TAttachment]>

	export type RemoveFunction = (attachment: TAttachment) => Promise<{
		error: Error | null
		data: TAttachment | null
	}>
</script>

<script lang="ts">
	import type { TAttachment } from '$lib/types'

	import src from '$lib/utils/src'
	import Icon from '@iconify/svelte'
	import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js'
	import uniqueId from 'lodash/uniqueId'
	import { createEventDispatcher } from 'svelte'
	import SvelteSortable from 'svelte-sortablejs'
	import BaseImage from './BaseImage.svelte'
	import cn from '$lib/utils/cn'

	export let attachments: TAttachment[] = []
	export let upload: UploadFunction
	export let remove: RemoveFunction

	let innerAttachments: InnerAttachment[] = attachments.map((attachment) => ({
		...attachment,
		isLoading: false
	}))
	let initialAttachments = [...innerAttachments]

	let inputElement: HTMLInputElement

	const onFileList = (files: FileList | File[]) => {
		files = [...files].filter((file) => {
			return !innerAttachments.some((attachment) => {
				return attachment.file?.name === file.name
			})
		})
		innerAttachments = [
			...innerAttachments,
			...files.map((file) => {
				const src = URL.createObjectURL(file)
				return {
					src,
					file,
					isLoading: false,
					id: `new-${uniqueId()}`,
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

	const onClickRemove = (attachment: InnerAttachment) => async () => {
		if (!attachment.file) {
			if (confirm('Are you sure to remove?')) {
				setAttachment({ ...attachment, isLoading: true })
				const { error } = await remove(attachment)
				if (error) {
					return setAttachment({
						...attachment,
						error,
						isLoading: false
					})
				}
				innerAttachments = innerAttachments.filter((item) => {
					return attachment.id !== item.id
				})
			}
			return
		}
		innerAttachments = innerAttachments.filter((item) => {
			return attachment.id !== item.id
		})
	}

	const reset = () => {
		innerAttachments = [...initialAttachments]
	}

	let isDirty = false
	$: {
		isDirty =
			innerAttachments.some((v) => v.id.startsWith('new')) ||
			innerAttachments.length !== initialAttachments.length
	}

	// Dropzone
	let isDropable = true
	let isHighlighted = false
	const highlight = () => {
		if (!isDropable) return
		if (!isHighlighted) {
			isHighlighted = true
		}
	}
	const unHighlight = () => {
		if (isHighlighted) {
			isHighlighted = false
		}
		if (!isDropable) {
			isDropable = true
		}
	}
	const drop = (e: any) => {
		onFileList(e.dataTransfer.files as FileList)
		unHighlight()
	}

	const setAttachment = (attachment: InnerAttachment) => {
		innerAttachments = innerAttachments.map((item) => {
			if (attachment.id === item.id || attachment.localId === item.id) {
				return {
					...item,
					...attachment
				}
			}
			return item
		})
	}

	const dispatch = createEventDispatcher()
	const onClickSave = async () => {
		innerAttachments.forEach((attachment) => {
			if (attachment.file) {
				setAttachment({ ...attachment, isLoading: true })
				upload(attachment.file).then(([error, newAttachment = {}]) => {
					setAttachment({
						...attachment,
						...newAttachment,
						error,
						file: undefined,
						isLoading: false,
						localId: attachment.id
					})
				})
			}
		})
	}

	let clazz = ''
	export { clazz as class }
</script>

<div
	class={cn('relative p-4 shadow-xl bg-base-100 rounded-xl', clazz)}
	on:dragenter|preventDefault|stopPropagation={highlight}
	on:mouseleave={() => (isDropable = true)}
	on:mouseenter={() => (isDropable = false)}
>
	{#if isHighlighted && isDropable}
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-4 transition-all border-2 border-dashed bg-primary bg-opacity-20 border-primary rounded-xl backdrop-blur"
			on:dragover|preventDefault|stopPropagation={highlight}
			on:drop|preventDefault|stopPropagation={drop}
			on:dragleave|preventDefault|stopPropagation={unHighlight}
		>
			<Icon icon="ci:files" class="text-white pointer-events-none text-7xl" />
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
				<button class="normal-case btn btn-outline btn-sm btn-error" on:click={reset}>Reset</button>
				<button class="normal-case btn btn-sm btn-primary" on:click={onClickSave}>Save</button>
			</div>
		{/if}
	</div>

	<SvelteSortable
		list={innerAttachments}
		setList={(e) => (innerAttachments = e)}
		class="grid grid-cols-3 gap-4 mt-4"
	>
		{#each innerAttachments as attachment, index}
			<div class="relative h-64 group" data-id={attachment.id}>
				{#if attachment.id.startsWith('new')}
					<div class="absolute badge badge-primary top-1 right-1">New</div>
				{/if}
				<BaseImage
					alt={attachment.name}
					src={src(attachment.thumbnail)}
					class="object-cover object-top w-full h-full rounded-xl"
				/>
				<button
					class="absolute opacity-0 btn btn-circle btn-sm btn-error bottom-1 right-1 group-hover:opacity-100"
					on:click={onClickRemove(attachment)}
				>
					<Icon icon="ic:outline-delete" class="text-lg" />
				</button>

				{#if attachment.isLoading}
					<div class="absolute inset-0 grid bg-black rounded-xl bg-opacity-70 place-items-center">
						<progress class="w-32 progress progress-secondary" />
					</div>
				{/if}
			</div>
		{/each}
		<button
			data-draggable="false"
			class="grid h-64 bg-base-300 place-items-center rounded-xl hover:bg-base-200"
			on:click={openFilePicker}
		>
			<Icon icon="material-symbols:add" class="opacity-50 text-7xl" />
		</button>
	</SvelteSortable>
</div>

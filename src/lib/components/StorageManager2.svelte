<script lang="ts" context="module">
	import type { TAttachment, TSupabase, TUser } from '$lib/types'

	export type OnSelectHandler = (
		attachments: TAttachment[],
		options: {
			reset: () => void
		}
	) => void
</script>

<script lang="ts">
	import { page } from '$app/stores'
	import { useArray } from 'sveltuse'
	import { resizeImage } from '$lib/utils/resizeImage'

	import BaseImage from './base/BaseImage.svelte'
	import dataURLtoFile from '$lib/utils/dataURLtoFile'
	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	export let folder = ''
	export let bucket = 'uploads'
	export let title = 'Storage Manager'

	let supabase: TSupabase
	let user: TUser = null as unknown as TUser

	$: {
		user = $page.data.user
		supabase = $page.data.supabase
	}

	$: if (user && !folder) {
		folder = `users/${user.id}`
	}

	const attachments = useArray<TAttachment>([])

	const getAttachments = async () => {
		const { data, error } = await supabase
			.from('attachments')
			.select('*')
			.limit(100)
			.eq('userId', user.id)

			.order('createdAt', { ascending: false })

		if (error) {
			console.log('getAttachments', { error })
			return
		}

		attachments.set(data)
	}

	$: if (bucket && folder) {
		console.log('getAttachments')
		getAttachments()
	}

	const getThumbnail = (attachment: TAttachment) => {
		const name = attachment.thumbnail || attachment.medium || attachment.src
		return supabase.storage.from(attachment.bucket).getPublicUrl(`${attachment.folder}/${name}`)
			?.data?.publicUrl
	}

	let selectedIds: string[] = []
	const onToggle = (attachment: TAttachment) => (e: any) => {
		e.stopPropagation()
		if (selectedIds.includes(attachment.id)) {
			selectedIds = selectedIds.filter((v: any) => {
				return v !== attachment.id
			})
			return
		}
		selectedIds = [...selectedIds, attachment.id]
	}

	const files = useArray<{
		file: File
		objectURL: string
		isLoading: boolean
	}>([])

	const onInputFiles = (e: any) => {
		files.set(
			[...e.target.files].map((file) => ({
				file,
				isLoading: false,
				objectURL: URL.createObjectURL(file)
			}))
		)

		$files.forEach(async (item) => {
			try {
			} catch (error) {}
			item.update({ isLoading: true })

			const url = item._.objectURL
			const ext = item._.file.name.split('.').pop()

			const name = url.split('/').pop() as string
			const name800 = name + '--800p'
			const name400 = name + '--400p'

			const file = dataURLtoFile(await resizeImage(item._.file, { maxWidth: 1600 }))
			const file800 = dataURLtoFile(await resizeImage(item._.file, { maxWidth: 800 }))
			const file400 = dataURLtoFile(await resizeImage(item._.file, { maxWidth: 400 }))

			const { data: fileObject } = await supabase.storage
				.from(bucket)
				.upload(`${folder}/${name}.${ext}`, file as File)

			const { data: fileObject800 } = await supabase.storage
				.from(bucket)
				.upload(`${folder}/${name800}.${ext}`, file800 as File)

			const { data: fileObject400 } = await supabase.storage
				.from(bucket)
				.upload(`${folder}/${name400}.${ext}`, file400 as File)

			const { data: attachment, error } = await supabase
				.from('attachments')
				.insert({
					bucket,
					folder,
					userId: user.id,
					name: `${name}.${ext}`,
					mimeType: item._.file.type,
					src: (fileObject?.path || '').split('/').pop() || '',
					medium: (fileObject800?.path || '').split('/').pop(),
					thumbnail: (fileObject400?.path || '').split('/').pop(),
					base64: await resizeImage(item._.file, { maxWidth: 3 })
				})
				.select('*')
				.single()

			item.update({ isLoading: false })

			if (error) {
				console.log('attachment:error', error)
				return
			}

			item.remove()
			attachments.unshift(attachment)
		})
	}

	const isPDF = (v: string) => {
		return v === 'application/pdf' || v.split('.').pop() === 'pdf'
	}

	const isImage = (v: string) => {
		return v.startsWith('image/') || /\.(jpe?g|png|gif|bmp|webp|avif)$/i.test(v)
	}

	export let onSelect: OnSelectHandler = () => {
		//
	}

	const onClickSelect = () => {
		onSelect(
			$attachments
				.filter((attachment) => {
					return selectedIds.includes(attachment._.id)
				})
				.map((v) => v._),
			{
				reset() {
					selectedIds = []
				}
			}
		)
	}
</script>

<div class={cn('relative', $$props.class || 'p-5')}>
	<div class="max-w-sm w-full overflow-auto p-4 flex flex-col space-y-2 fixed right-4 bottom-0">
		{#each $files as item}
			<div class="bg-base-100 rounded shadow relative">
				<div class="flex items-center space-x-2 flex-1 p-2">
					<img
						src={item._.objectURL}
						alt={item._.file.name}
						class="w-10 h-10 rounded object-cover object-center flex-none"
					/>
					<div class="flex-1 overflow-hidden">
						<div class="truncate text-sm">{item._.file.name}</div>
						<div class="text-xs opacity-70">
							{item._.file?.type}, {Math.round((item._.file?.size || 1024) / 1024)}KB
						</div>
					</div>
				</div>
				{#if item._.isLoading}
					<progress class="progress progress-primary absolute inset-x-0 bottom-0 h-1" />
				{/if}
			</div>
		{/each}
	</div>

	<div class="navbar bg-base-100 min-h-[48px] flex justify-between rounded">
		<div>
			{#if !selectedIds.length}
				<div class="text-2xl font-medium">
					{title}
				</div>
			{:else}
				<div class="text-xl font-medium flex items-center space-x-2">
					<button
						class="btn btn-circle btn-sm"
						on:click={() => {
							selectedIds = []
						}}
					>
						<Icon class="text-xl" icon="mdi-close" />
					</button>
					<span>{selectedIds.length} selected</span>
				</div>
			{/if}
		</div>

		{#if !selectedIds.length}
			<button class="btn btn-primary btn-sm relative" class:disabled={!bucket || !folder}>
				Upload
				<input
					multiple
					type="file"
					accept="images/*"
					class="opacity-0 absolute inset-0"
					on:input={onInputFiles}
				/>
			</button>
		{/if}

		{#if selectedIds.length > 0}
			<div class="flex items-center space-x-2">
				<button
					class="btn btn-outline btn-circle btn-error btn-sm"
					on:click={() => {
						selectedIds = []
					}}
				>
					<Icon class="text-lg" icon="mdi-delete-outline" />
				</button>
				<button
					class="btn btn-accent btn-outline rounded-full btn-sm normal-case"
					on:click={onClickSelect}
				>
					Select
				</button>
			</div>
		{/if}
	</div>

	<div
		class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-5"
	>
		{#each $attachments || [] as attachment}
			<!-- {@const res = getResolution(file.name)} -->
			<div class="h-52 flex flex-col bg-base-100 rounded overflow-hidden shadow-md relative group">
				<div
					class={cn(
						'absolute top-0.5 right-0.5 rounded-[9px] w-6 h-6 bg-black flex items-center justify-center',
						selectedIds.length > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
					)}
				>
					<input
						type="checkbox"
						class="checkbox checkbox-primary checkbox-sm border-solid border-2"
						checked={selectedIds.includes(attachment._.id)}
						on:input={onToggle(attachment._)}
					/>
				</div>
				<button
					class={cn(
						selectedIds.length > 0 ? 'absolute inset-0' : '',
						selectedIds.includes(attachment._.id) ? 'bg-primary bg-opacity-20' : ''
					)}
					on:click={onToggle(attachment._)}
				/>

				<div class="absolute text-xs top-1 left-1">
					{#if attachment._.thumbnail}
						<span class="bg-primary text-white rounded-full px-1"> 400p </span>
					{/if}

					{#if attachment._.medium}
						<span class="bg-primary text-white rounded-full px-1"> 800p </span>
					{/if}
				</div>

				{#if isImage(attachment._.name)}
					{@const src = getThumbnail(attachment._)}
					<div class="flex-1 overflow-hidden">
						<BaseImage
							lazySrc={src}
							alt={attachment._.name}
							src={attachment._.base64 || src}
							class="object-top object-cover h-full w-full"
						/>
					</div>
				{:else if isPDF(attachment._.name)}
					<div class="flex-1 grid place-items-center">
						<Icon color="#A21C2B" class="text-7xl" icon="fa-solid:file-pdf" />
					</div>
				{/if}
				<div class="flex-none p-2 text-sm">
					<div class="truncate">{attachment._.name}</div>
					<div class="text-xs opacity-70">
						{attachment._.mimeType}
						<!-- , {Math.round((file.metadata?.size || 1024) / 1024)}KB -->
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

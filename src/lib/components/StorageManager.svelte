<script lang="ts">
	import type { PageData } from '../../routes/(landing)/$types'
	import type { FileObject } from '$lib/modules/Storage'

	import cn from '$lib/utils/cn'
	import src from '$lib/utils/src'
	import Icon from '@iconify/svelte'
	import dataURLtoFile from '$lib/utils/dataURLtoFile'
	import useSupabaseStorage from '$lib/utils/useSupabaseStorage'

	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { useArray } from 'sveltuse'
	import { toFileName } from '$lib/utils/toFileName'
	import { resizeImage } from '$lib/utils/resizeImage'
	import { useStorageModule } from '$lib/modules/Storage'
	import { useGlobalPageData } from '$lib/utils/useGlobalPageData'

	type FileItem = {
		file: File
		src: string
		filename: string
		isUploading: boolean
		error: Error | null
		data: { path: string } | null
	}

	export let bucket = ''
	export let folder = ''
	export let onSelect: (files: FileObject[]) => void = () => {
		//
	}

	let selectedIds: any = []

	const { user, supabase } = useGlobalPageData()
	const Storage = useStorageModule({ user, supabase })

	let fileObjects: {
		data: never[] | FileObject[] | null
		error: any | null
	} = {
		data: [],
		error: null
	}

	const fetchFiles = async () => {
		fileObjects = await Storage.list({
			bucket,
			folder
		})
	}

	const onToggle = (file: any) => (e: any) => {
		e.stopPropagation()
		if (selectedIds.includes(file.id)) {
			selectedIds = selectedIds.filter((v: any) => {
				return v !== file.id
			})
			return
		}
		selectedIds = [...selectedIds, file.id]
	}

	const storage = useSupabaseStorage(supabase)

	const files = useArray<FileItem>([])

	const onInputFile = async (event: any) => {
		files.set(
			(
				await Promise.all(
					[...event.target.files]
						.reduce<any[]>((files, file) => {
							if (!isImage(file.name)) {
								files.push({
									file,
									src: '',
									data: null,
									error: null,
									isUploading: false,
									filename: toFileName(file.name)
								})
								return files
							}

							const src = URL.createObjectURL(file)
							const filename = toFileName(file.name, { uuid: src.split('/').pop() })
							files.push(
								{
									src,
									data: null,
									error: null,
									isUploading: false,
									file: resizeImage(file, { maxWidth: 400 }),
									filename: toFileName(filename, { uuid: false, postfix: '--400p' })
								},
								{
									src,
									data: null,
									error: null,
									isUploading: false,
									file: resizeImage(file, { maxWidth: 800 }),
									filename: toFileName(filename, { uuid: false, postfix: '--800p' })
								},
								{
									src,
									filename,
									data: null,
									error: null,
									isUploading: false,
									file: resizeImage(file, { maxWidth: 1600 })
								}
							)
							return files
						}, [])
						.map(async (fileItem) => ({
							...fileItem,
							file: dataURLtoFile(await fileItem.file)
						}))
				)
			).filter((v) => !!v.file)
		)

		$files.forEach(async (item) => {
			item.update({ isUploading: true })

			const { error } = await storage.upload({
				bucket,
				path: folder,
				file: item._.file,
				filename: item._.filename
			})

			if (error) {
				item.update({
					error,
					isUploading: false
				})
				return
			}

			fetchFiles()
			files.remove((v) => {
				return v.filename === item._.filename
			})
		})
	}

	const isPDF = (v: string) => {
		return v === 'application/pdf' || v.split('.').pop() === 'pdf'
	}

	const isImage = (v: string) => {
		return v.startsWith('image/') || /\.(jpe?g|png|gif|bmp|webp|avif)$/i.test(v)
	}

	const getSrc = (file: FileObject, files = fileObjects.data) => {
		const file400 = (files || []).find((item) => {
			return (
				item.name ===
				toFileName(file.name.replace('--400p', '').replace('--800p', ''), {
					uuid: false,
					postfix: '--400p'
				})
			)
		})
		return src(file400?.name || file.name, { bucket, folder })
	}

	const getResolution = (name: string): '400p' | '800p' | '' => {
		if (name.includes('--400p')) return '400p'
		if (name.includes('--800p')) return '800p'
		return ''
	}

	const onClickSelect = () => {
		onSelect(
			(fileObjects.data || []).filter((file) => {
				return selectedIds.includes(file.id)
			})
		)
	}

	let data: PageData
	$: {
		data = $page.data as PageData
	}

	const fetchAttachments = async () => {
		if (!data.user) return

		const res = await ($page.data as PageData).supabase
			.from('attachments')
			.select('*')
			.eq('userId', data.user.id)
			.order('createdAt', { ascending: false })

		console.log(res)
	}

	onMount(() => {
		console.log({ bucket, folder })
		if (bucket && folder) {
			// fetchFiles()
			fetchAttachments()
		}
	})
</script>

<div class={cn('relative', $$props.class || 'p-5')}>
	<div class="max-w-sm w-full overflow-auto p-4 flex flex-col space-y-2 fixed right-0 bottom-0">
		{#each $files as item}
			<div class="bg-base-100 rounded shadow relative">
				<div class="flex items-center space-x-2 flex-1 p-2">
					<img
						src={item._.src}
						alt={item._.filename}
						class="w-10 h-10 rounded object-cover object-center flex-none"
					/>
					<div class="flex-1 overflow-hidden">
						<div class="truncate text-sm">{item._.filename}</div>
						<div class="text-xs opacity-70">
							{item._.file?.type}, {Math.round((item._.file?.size || 1024) / 1024)}KB
						</div>
					</div>
				</div>
				{#if item._.isUploading}
					<progress class="progress progress-primary absolute inset-x-0 bottom-0 h-1" />
				{/if}
			</div>
		{/each}
	</div>

	<div class="navbar bg-base-100 min-h-[48px] flex justify-end rounded">
		<button class="btn btn-primary btn-sm relative" class:disabled={!bucket || !folder}>
			Upload
			<input
				multiple
				type="file"
				accept="images/*"
				class="opacity-0 absolute inset-0"
				on:input={onInputFile}
			/>
		</button>
		{#if selectedIds.length > 0}
			<button class="btn btn-primary btn-sm" on:click={onClickSelect}>Select</button>
		{/if}
	</div>
	<div
		class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-3"
	>
		{#each fileObjects.data || [] as file}
			{@const res = getResolution(file.name)}
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
						checked={selectedIds.includes(file.id)}
						on:input={onToggle(file)}
					/>
				</div>
				<button
					class={cn(
						selectedIds.length > 0 ? 'absolute inset-0' : '',
						selectedIds.includes(file.id) ? 'bg-primary bg-opacity-20' : ''
					)}
					on:click={onToggle(file)}
				/>

				{#if res}
					<span class="absolute text-xs top-1 left-1 bg-primary text-white rounded-full px-1">
						{res}
					</span>
				{/if}

				{#if isImage(file.name)}
					<div class="flex-1 overflow-hidden">
						<img
							alt={file.name}
							src={getSrc(file)}
							class="object-center object-cover h-full w-full"
						/>
					</div>
				{:else if isPDF(file.name)}
					<div class="flex-1 grid place-items-center">
						<Icon color="#A21C2B" class="text-7xl" icon="fa-solid:file-pdf" />
					</div>
				{/if}
				<div class="flex-none p-2 text-sm">
					<div class="truncate">{file.name}</div>
					<div class="text-xs opacity-70">
						{file.metadata?.mimetype}, {Math.round((file.metadata?.size || 1024) / 1024)}KB
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

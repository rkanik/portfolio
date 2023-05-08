<script lang="ts" context="module">
	type FileItem = {
		file: File
		src: string
		isLoading: boolean
	}
</script>

<script lang="ts">
	import { useStorageModule, type FileObject } from '$lib/modules/Storage'
	import { useContextStoreContext } from '$lib/store/useContextStore'

	import cn from '$lib/utils/cn'
	import src from '$lib/utils/src'
	import { onMount } from 'svelte'

	// export let data

	export let bucket: string | undefined
	export let folder: string | undefined

	let selectedIds: any = []

	const context = useContextStoreContext()
	const Storage = useStorageModule($context)

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

	let files: FileItem[] = []
	const onInputFile = async (event: any) => {
		files = Array.from(event.target.files as FileList).map((file: File) => {
			return {
				file,
				isLoading: false,
				src: URL.createObjectURL(file)
			}
		})

		files.forEach((file) => {})
	}

	$: {
		console.log(selectedIds)
	}

	onMount(() => {
		// fetchFiles()
	})
</script>

<div class="p-5 relative">
	<div class="max-w-sm w-full overflow-auto p-4 flex flex-col space-y-2 fixed right-0 bottom-0">
		{#each files as item}
			<div class="bg-base-100 rounded shadow relative">
				<div class="flex items-center space-x-2 flex-1 p-2">
					<img
						src={item.src}
						alt={item.file.name}
						class="w-10 h-10 rounded object-cover object-center flex-none"
					/>
					<div class="flex-1 overflow-hidden">
						<div class="truncate text-sm">{item.file.name}</div>
						<div class="text-xs opacity-70">
							{item.file.type}, {Math.round((item.file.size || 1024) / 1024)}KB
						</div>
					</div>
				</div>
				{#if item.isLoading}
					<progress class="progress progress-primary absolute inset-x-0 bottom-0 h-1" />
				{/if}
			</div>
		{/each}
	</div>

	<div class="navbar bg-base-100 min-h-[48px] flex justify-end rounded">
		<button class="btn btn-primary btn-sm relative">
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
			<button class="btn btn-primary btn-sm">Select</button>
		{/if}
	</div>
	<div
		class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-3"
	>
		{#each fileObjects.data || [] as file}
			<div class="h-52 flex flex-col bg-base-100 rounded overflow-hidden shadow-md relative group">
				<div
					class={cn(
						'absolute top-0.5 right-0.5 rounded-lg w-6 h-6 bg-black flex items-center justify-center',
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
				<div class="flex-1 overflow-hidden">
					<img
						alt={file.name}
						src={src(`projects/${file.name}`)}
						class="object-center object-cover h-full w-full"
					/>
				</div>
				<div class="flex-none p-2 text-sm">
					<div class="truncate">{file.name}</div>
					<div class="text-xs opacity-70">
						{file.metadata.mimetype}, {Math.round((file.metadata.size || 1024) / 1024)}KB
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

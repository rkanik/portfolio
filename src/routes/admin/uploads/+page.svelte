<script lang="ts">
	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import src from '$lib/utils/src.js'

	export let data
</script>

<div class="grid grid-cols-12 gap-4 p-5">
	{#each data.uploads.data || [] as file}
		<div class="h-48 col-span-2 flex flex-col bg-base-100 rounded overflow-hidden shadow-md">
			<div class="flex-1 overflow-hidden">
				<img
					alt={file.name}
					src={src(`projects/${file.name}`)}
					class="object-center object-cover h-full w-full"
				/>
			</div>
			<div class="flex-none p-2 text-sm">
				<div>{file.name}</div>
				<div class="text-xs opacity-70">
					{file.metadata.mimetype}, {Math.round((file.metadata.size || 1024) / 1024)}KB
				</div>
			</div>
		</div>
	{/each}
</div>

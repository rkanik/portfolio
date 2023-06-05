<script lang="ts">
	import type { FileObject } from '$lib/modules/Storage'
	import BaseModal from './base/BaseModal.svelte'
	import StorageManager from './StorageManager.svelte'

	export let value = false
	export let onSelect: (files: FileObject[]) => void = () => {
		//
	}

	export let bucket = ''
	export let folder = ''

	let isInitialized = false
	$: if (value && !isInitialized) {
		isInitialized = true
	}
</script>

<BaseModal bind:value modalBox="!max-w-full">
	<svelte:fragment slot="activator" let:onClick>
		<slot name="activator" {onClick}>
			<button class="btn btn-primary">Storage Picker</button>
		</slot>
	</svelte:fragment>
	{#if isInitialized}
		<StorageManager {bucket} {folder} {onSelect} class="p-0" />
	{/if}
</BaseModal>

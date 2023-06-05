<script lang="ts">
	import BaseModal from './base/BaseModal.svelte'
	import StorageManager2, { type OnSelectHandler } from './StorageManager2.svelte'

	export let value = false
	export let onSelect: OnSelectHandler = () => {
		//
	}

	export let folder = ''
	export let bucket = 'uploads'

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
		<StorageManager2 {bucket} {folder} {onSelect} class="p-0" />
	{/if}
</BaseModal>

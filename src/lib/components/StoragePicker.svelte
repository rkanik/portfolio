<script lang="ts">
	import BaseModal from './base/BaseModal.svelte'
	import StorageManager2, { type OnSelectHandler } from './StorageManager2.svelte'

	export let value = false
	export let multiple: boolean = true
	export let onSelect: OnSelectHandler = () => {
		//
	}

	const onSelectInner: OnSelectHandler = (v, { reset }) => {
		onSelect(v, {
			reset() {
				reset()
				value = false
			}
		})
	}

	export let folder = ''
	export let bucket = 'uploads'

	let isInitialized = false
	$: if (value && !isInitialized) {
		isInitialized = true
	}

	$: {
		console.log('StoragePicker:modal', value)
	}
</script>

<BaseModal bind:value modalBox="!max-w-full">
	<svelte:fragment slot="activator" let:onClick>
		<slot name="activator" {onClick}>
			<button class="btn btn-primary">Storage Picker</button>
		</slot>
	</svelte:fragment>
	{#if isInitialized}
		<StorageManager2 {bucket} {folder} {multiple} onSelect={onSelectInner} class="p-0" />
	{/if}
</BaseModal>

<script lang="ts">
	import BaseModal from './base/BaseModal.svelte'
	import StorageManager2, { type OnSelectHandler } from './StorageManager2.svelte'

	export let modal: boolean
	export let selected: string[] = []
	export let multiple: boolean = true
	export let onSelect: OnSelectHandler = () => {
		//
	}

	const onSelectInner: OnSelectHandler = (v, { reset }) => {
		onSelect(v, {
			reset() {
				reset()
				modal = false
			}
		})
	}

	export let folder = ''
	export let bucket = 'uploads'

	let isInitialized = false
	$: if (modal && !isInitialized) {
		isInitialized = true
	}
</script>

<BaseModal bind:value={modal} modalBox="!max-w-full">
	<svelte:fragment slot="activator">
		<slot>
			<button type="button" class="btn btn-primary">Storage Picker</button>
		</slot>
	</svelte:fragment>
	{#if isInitialized}
		<StorageManager2
			bind:selected
			{bucket}
			{folder}
			{multiple}
			class="p-0"
			onSelect={onSelectInner}
		/>
	{/if}
</BaseModal>

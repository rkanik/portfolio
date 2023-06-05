<script lang="ts">
	import StorageManager from '$lib/components/StorageManager.svelte'
	export let data
</script>

<StorageManager bucket="uploads" folder={`users/${data.user?.id || ''}`} />

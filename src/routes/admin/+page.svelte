<script lang="ts">
	export let data
</script>

<svelte:head>
	<title>Admin | RK Anik</title>
</svelte:head>

{#if !data.session}
	<div>Admin Dashboard</div>
{/if}

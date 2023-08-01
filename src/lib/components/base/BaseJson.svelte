<script lang="ts">
	export let data: any
	export let space = 3
</script>

<div class="p-4 rounded-lg bg-neutral-900 overflow-auto">
	<pre><code>{JSON.stringify(data, null, space)}</code></pre>
</div>

<script lang="ts">
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'

	const greeting = trpc($page).greeting.createQuery()
</script>

<div class="p-4">
	<p>{$greeting.data}</p>
</div>

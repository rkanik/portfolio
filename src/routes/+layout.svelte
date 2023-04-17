<script lang="ts">
	import { getSupabaseStore, setSupabaseContext } from '$lib/store/useSupabase'

	export let data
	const supabaseStore = getSupabaseStore()

	$: {
		supabaseStore.set(data.supabase)
	}

	setSupabaseContext(supabaseStore)
</script>

<slot />

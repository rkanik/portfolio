<script lang="ts">
	import { setContextStoreContext, useContextStore } from '$lib/store/useContextStore'
    
	export let data
	const contextStore = useContextStore()

	$: {
		contextStore.set({
			publicUser: data.publicUser,
			user: data.user,
			session: data.session,
			supabase: data.supabase
		})
	}
	setContextStoreContext(contextStore)
</script>

<slot />

<script lang="ts">
	import { setContextStoreContext, useContextStore } from '$lib/store/useContextStore'
	import type { TPublicContext } from '$lib/types.js'
	import { useContext } from 'sveltuse'

	export let data
	const contextStore = useContextStore()

	useContext<TPublicContext>('pageData', {
		publicUser: data.publicUser,
		user: data.user,
		session: data.session,
		supabase: data.supabase
	})

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

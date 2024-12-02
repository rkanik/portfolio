import { browser } from '$app/environment'
import { QueryClient } from '@tanstack/svelte-query'

export const load = async (event) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	})
	return {
		...event.data,
		queryClient
	}
}

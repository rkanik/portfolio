import type { Database } from '@/supabase'
import type { LayoutLoad } from './$types'
import {
	createBrowserClient,
	createServerClient,
	isBrowser,
} from '@supabase/ssr'
import { QueryClient } from '@tanstack/svelte-query'
import { browser } from '$app/environment'
import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL,
} from '$env/static/public'

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth')

	const supabase = isBrowser()
		? createBrowserClient<Database, 'portfolio'>(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_ANON_KEY,
				{
					global: {
						fetch,
					},
					db: {
						schema: 'portfolio',
					},
				},
			)
		: createServerClient<Database, 'portfolio'>(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_ANON_KEY,
				{
					global: {
						fetch,
					},
					cookies: {
						getAll() {
							return data.cookies
						},
					},
					db: {
						schema: 'portfolio',
					},
				},
			)

	const session = await supabase.auth.getSession()

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				refetchOnMount: true,
				refetchOnReconnect: true,
				refetchOnWindowFocus: true,
			},
		},
	})

	return {
		supabase,
		queryClient,
		publicUser: data.publicUser,
		user: session.data.session?.user || null,
		session: session.data.session,
	}
}

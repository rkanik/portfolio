import type { TPublicUser } from '$lib/types'
import type { TProfile } from '$lib/types/Profile'
import type { Database } from './supabase'
import { createServerClient } from '@supabase/ssr'
import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL,
	PUBLIC_USER_ID,
} from '$env/static/public'
import { router } from '$lib/trpc/router'
import { createTRPCHandle } from 'trpc-sveltekit'

export const handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database, 'portfolio'>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			db: {
				schema: 'portfolio',
			},
			cookies: {
				getAll() {
					return event.cookies.getAll()
				},
				setAll(cookiesToSet) {
					/**
					 * Note: You have to add the `path` variable to the
					 * set and remove method due to sveltekit's cookie API
					 * requiring this to be set, setting the path to an empty string
					 * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
					 */
					cookiesToSet.forEach(({ name, value, options }) =>
						event.cookies.set(name, value, { ...options, path: '/' }),
					)
				},
			},
		},
	)

	event.locals.getSession = async () => {
		const user = await event.locals.supabase.auth.getUser()
		const session = await event.locals.supabase.auth.getSession()
		return {
			user: user.data.user,
			session: session.data.session,
		}
	}

	event.locals.getContext = async () => {
		// Supabase instance

		// Public user
		const profile = await event.locals.supabase
			.from('profiles')
			.select('*')
			.eq('id', PUBLIC_USER_ID)
			.single()

		const publicUser: TPublicUser = {
			id: PUBLIC_USER_ID,
			profile: profile.data as TProfile | null,
		}

		// Current session
		const session = await event.locals.supabase.auth.getSession()

		// returning the context
		return {
			publicUser,
			user: session.data.session?.user || null,
			session: session.data.session,
			supabase: event.locals.supabase,
		}
	}

	console.log('::handle::')
	return createTRPCHandle({
		router,
		createContext: (e) => e.locals,
	})({ event, resolve })
	// return resolve(event, {
	// 	filterSerializedResponseHeaders(name) {
	// 		return name === 'content-range'
	// 	},
	// 	transformPageChunk({ html }) {
	// 		const cookieTheme = event.cookies.get('theme')
	// 		const theme =
	// 			cookieTheme && themes.find((item) => item.id === cookieTheme)?.id

	// 		if (theme) html = html.replace('%theme%', `data-theme="${theme}"`)

	// 		return html
	// 	},
	// })
}

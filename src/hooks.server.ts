// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit'
import type { TPublicUser } from '$lib/types'
import type { TProfile } from '$lib/types/Profile'
import { createServerClient } from '@supabase/ssr'
import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL,
	PUBLIC_USER_ID,
} from '$env/static/public'
import { themes } from '$lib/data'

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
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

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	//
	event.locals.getSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession()
		if (!session) {
			return { session: null, user: null }
		}

		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser()
		if (error) {
			// JWT validation has failed
			return { session: null, user: null }
		}

		return { session, user }
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

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range'
		},
		transformPageChunk({ html }) {
			const cookieTheme = event.cookies.get('theme')
			const theme =
				cookieTheme && themes.find((item) => item.id === cookieTheme)?.id

			if (theme) html = html.replace('%theme%', `data-theme="${theme}"`)

			return html
		},
	})
}

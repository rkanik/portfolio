// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_USER_ID } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'
import type { Database } from './supabase'
import type { TProfile, TPublicUser, TSupabase } from '$lib/types'

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.getContext = async () => {
		// Supabase instance
		const supabase: TSupabase = createSupabaseServerClient<Database>({
			event,
			supabaseUrl: PUBLIC_SUPABASE_URL,
			supabaseKey: PUBLIC_SUPABASE_ANON_KEY
		})

		// Public user
		const profile = await supabase.from('profiles').select('*').eq('id', PUBLIC_USER_ID).single()
		const publicUser: TPublicUser = {
			id: PUBLIC_USER_ID,
			profile: profile.data as TProfile | null
		}

		// Current session
		const session = await supabase.auth.getSession()

		// returning the context
		return {
			publicUser,
			user: session.data.session?.user || null,
			session: session.data.session,
			supabase
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range'
		}
	})
}

import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { Database } from '../supabase'

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth')
	const supabase = createSupabaseLoadClient<Database>({
		event: { fetch },
		serverSession: data.session,
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY
	})
	const {
		data: { session }
	} = await supabase.auth.getSession()
	return { supabase, session }
}

import type { TPublicUser } from '$lib/types'
import type { Database } from '../../supabase'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

import { page } from '$app/stores'
import { get_store_value } from 'svelte/internal'

export type TGlobalPageData = {
	user: User | null
	session: Session | null
	publicUser: TPublicUser
	supabase: SupabaseClient<Database>
}

export const useGlobalPageData = <T>() => {
	return get_store_value(page).data as T & TGlobalPageData
}

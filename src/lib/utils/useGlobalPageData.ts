import { page } from '$app/stores'
import { toValue } from './toValue'

import type { TPublicUser } from '$lib/types'
import type { Database } from '../../supabase'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

export type TGlobalPageData = {
	user: User | null
	session: Session | null
	publicUser: TPublicUser
	supabase: SupabaseClient<Database>
}

export const useGlobalPageData = <T>() => {
	return toValue(page).data as T & TGlobalPageData
}

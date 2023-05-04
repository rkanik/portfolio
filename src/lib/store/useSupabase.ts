import { getContext, setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

import type { TSupabase } from '$lib/types'

export type SupabaseStore = Writable<TSupabase>

export const getSupabaseStore = () => writable<TSupabase>()
export const getSupabaseContext = () => getContext<SupabaseStore>('supabase')
export const setSupabaseContext = (context: SupabaseStore) => {
	setContext('supabase', context)
}

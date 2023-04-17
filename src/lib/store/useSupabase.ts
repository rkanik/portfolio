import { getContext, setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

import type { SupabaseClient } from '@supabase/supabase-js'

export type SupabaseStore = Writable<SupabaseClient>

export const getSupabaseStore = () => writable<SupabaseClient>()
export const getSupabaseContext = () => getContext<SupabaseStore>('supabase')
export const setSupabaseContext = (context: SupabaseStore) => {
	setContext('supabase', context)
}

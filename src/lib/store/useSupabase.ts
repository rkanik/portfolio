import { getContext, setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase'

export type SupabaseStore = Writable<SupabaseClient<Database>>

export const getSupabaseStore = () => writable<SupabaseClient<Database>>()
export const getSupabaseContext = () => getContext<SupabaseStore>('supabase')
export const setSupabaseContext = (context: SupabaseStore) => {
	setContext('supabase', context)
}

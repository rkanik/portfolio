// import { Session } from '@supabase/supabase-js'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { TContext } from '$lib/types'
import type { Database } from './supabase'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getContext(): Promise<TContext>
			supabase: SupabaseClient<Database, 'portfolio'>
			getSession(): Promise<{
				user: User | null
				session: Session | null
			}>
		}
		interface PageData {
			user: User | null
			session: Session | null
			supabase: SupabaseClient<Database, 'portfolio'>
		}
		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace
			}
			context: {
				waitUntil(promise: Promise<unknown>): void
			}
			caches: CacheStorage & { default: Cache }
		}
	}
}

export {}

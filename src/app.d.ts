import { SupabaseClient, Session } from '@supabase/supabase-js'
import type { Database } from './supabase'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string
			}
			supabase: SupabaseClient<Database>
			getSession(): Promise<Session | null>
		}
		interface PageData {
			session: Session | null
		}
		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace
			}
			context: {
				waitUntil(promise: Promise<any>): void
			}
			caches: CacheStorage & { default: Cache }
		}
	}
}

export {}

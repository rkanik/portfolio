// import { Session } from '@supabase/supabase-js'
import type { TContext } from '$lib/types'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getContext(): Promise<TContext>
		}
		// interface PageData {
		// 	session: Session | null
		// }
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

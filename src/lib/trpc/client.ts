import type { QueryClient } from '@tanstack/svelte-query'
import type { TRPCClientInit } from 'trpc-sveltekit'
import type { Router } from './router'
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter'
import { createTRPCClient } from 'trpc-sveltekit'

let browserClient: ReturnType<typeof svelteQueryWrapper<Router>>

export function trpc(init?: TRPCClientInit, queryClient?: QueryClient) {
	const isBrowser = typeof window !== 'undefined'
	if (isBrowser && browserClient) return browserClient
	const client = svelteQueryWrapper<Router>({
		client: createTRPCClient<Router>({ init }),
		queryClient,
	})
	if (isBrowser) browserClient = client
	return client
}
 
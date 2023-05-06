import { writable, type Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'

import type { TPublicContext } from '$lib/types'

export const useContextStore = () => writable<TPublicContext>()
export const useContextStoreContext = () => getContext<Writable<TPublicContext>>('context')
export const setContextStoreContext = (context: Writable<TPublicContext>) => {
	setContext('context', context)
}

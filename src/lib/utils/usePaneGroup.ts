import type { Cookies } from '@sveltejs/kit'
import { getContext } from 'svelte'

export const usePaneGroup = (key: string, value?: number[]) => {
	const cookies = getContext<ReturnType<Cookies['getAll']>>('cookies')
	const cookie = cookies.find((v) => v.name === `PaneForge:${key}`)?.value
	return {
		layout: cookie ? (JSON.parse(cookie) as number[]) : value,
		onLayoutChange(sizes: number[]) {
			document.cookie = `PaneForge:${key}=${JSON.stringify(sizes)};path=/;max-age=31536000`
		}
	}
}

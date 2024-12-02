import { getContext } from 'svelte'

export const cookieStorage: Storage = {
	getItem(key) {
		if (typeof document === 'undefined') {
			const cookies = getContext('cookies') as
				| {
						name: string
						value: string
				  }[]
				| undefined
			return (cookies || []).find((cookie) => cookie.name === key)?.value ?? null
		}
		return (
			document.cookie
				.split(';')
				.map((v) => v.split('='))
				.find((v) => v[0].trim() === key)
				?.pop()
				?.trim() ?? null
		)
	},
	setItem(key, value) {
		if (typeof document === 'undefined') return
		document.cookie = `${key}=${value}; path=/; max-age=31536000` // 1 year in seconds
	},
	removeItem(key) {
		console.log('cookieStorage:removeItem', key)
	},
	clear() {
		console.log('cookieStorage:clear')
	},
	key(index) {
		console.log('cookieStorage:key', index)
		return null
	},
	length: 0
}

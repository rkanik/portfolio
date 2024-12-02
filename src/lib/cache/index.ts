import Cache from 'timed-cache'

const cache = new Cache({
	defaultTtl: 1000 * 5 * 60
})

export const getOrPutCache = async <F extends () => Promise<unknown> | unknown>(
	key: string | unknown[],
	callback: F
) => {
	// const cached = cache.get(key)
	// if (cached) return cached as Awaited<ReturnType<F>>

	const response = await callback()
	cache.put(key, response)

	return response as Awaited<ReturnType<F>>
}

export default cache

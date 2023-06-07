import type { TPagination } from '$lib/types'

export const getSupabasePagination = (v?: TPagination) => {
	const { page = 1, perPage = 50 } = v || {}

	const from = (page - 1) * perPage
	const to = from + perPage

	return {
		page,
		perPage,
		nextPage: page + 1,
		from,
		to,
		limit: perPage
	}
}

import { DEFAULT_PER_PAGE } from '$lib/const'
import type { TPagination } from '$lib/types'

export const getSupabasePagination = (v?: TPagination) => {
	const { page = 1, perPage = DEFAULT_PER_PAGE } = v || {}

	const from = (page - 1) * perPage
	const to = from + perPage

	return {
		page,
		perPage,
		from,
		to,
		limit: perPage
	}
}

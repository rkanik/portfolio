import { DEFAULT_PER_PAGE } from '$lib/const'

export type TPaginated<T> = {
	page: number
	perPage: number
	count: number
	nextPage: number | null
	previousPage: number | null
	data: T[]
}

type Props<T> = {
	page?: number
	perPage?: number
	count?: number | null
	data?: T[]
}

export const toPaginated = <T>(props?: Props<T>): TPaginated<T> => {
	const { page = 1, perPage = DEFAULT_PER_PAGE, data = [] } = props || {}
	const count = props?.count ?? data?.length ?? 0
	return {
		page,
		perPage,
		count,
		nextPage: page * perPage <= count ? page + 1 : null,
		previousPage: page > 0 ? page - 1 : null,
		data: data as unknown as T[],
	}
}

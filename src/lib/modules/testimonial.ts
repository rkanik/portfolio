import type { TPagination, TPublicContext, TUserTestimonial } from '$lib/types'

type ListFilter = TPagination & {
	//
}

const getRange = (v?: TPagination) => {
	const { page = 1, perPage = 10 } = v || {}

	const from = page - 1 * perPage
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

export const createTestimonialModule = (context: TPublicContext) => {
	const { user, supabase } = context
	return {
		async list(filter?: ListFilter) {
			if (!user) {
				return {
					data: {
						page: 1,
						perPage: 10,
						data: [] as TUserTestimonial[]
					},
					error: new Error('Unauthorized')
				}
			}

			const { from, to, limit, ...pagination } = getRange(filter)

			const res = await supabase
				.from('userTestimonials')
				.select('*,testimonials(*)')
				.eq('userId', user.id)
				.range(from, to)
				.limit(limit)

			return {
				data: {
					...pagination,
					count: res.count,
					data: res.data as TUserTestimonial[]
				},
				error: res.error
			}
		}
	}
}

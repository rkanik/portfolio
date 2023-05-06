import type { TPagination, TPublicContext, TUserTestimonial } from '$lib/types'

type ListFilter = TPagination & {
	//
}

const getRange = (v?: TPagination) => {
	const { page = 1, perPage = 10 } = v || {}

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

export const useStorageModule = (context: TPublicContext) => {
	const { user, supabase } = context

	return {
		async list(filter?: ListFilter) {
			if (!user) {
				return {
					data: [],
					error: new Error('Unauthorized')
				}
			}

			const uploads = await supabase.storage.from('uploads').list('projects', {
				limit: 100,
				offset: 0,
				sortBy: {
					column: 'name',
					order: 'asc'
				}
			})

			return {
				data: uploads.data,
				error: uploads.error
			}
		}
	}
}

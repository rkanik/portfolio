import type { TId, TPagination, TTestimonial } from '$lib/types'

import { z } from 'zod'
import { useGlobalPageData } from '$lib/utils/useGlobalPageData'

type ListFilter = TPagination & {
	//
}

const getRange = (v?: TPagination) => {
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

const createSchema = z.object({
	name: z.string().min(1, 'Required.'),
	company: z.string().min(1, 'Required.'),
	testimonial: z.string().min(1, 'Required.'),
	rating: z.number().min(1).max(5),
	date: z.instanceof(Date).nullable(),
	avatar: z.string().nullable().optional()
})

export type CreateSchema = z.infer<typeof createSchema>

export const useTestimonialModule = () => {
	const { user, supabase } = useGlobalPageData()

	return {
		createSchema,
		async list(filter?: ListFilter) {
			if (!user) {
				return {
					data: {
						page: 1,
						perPage: 10,
						data: [] as TTestimonial[]
					},
					error: new Error('Unauthorized')
				}
			}

			const { from, to, limit, ...pagination } = getRange(filter)
			const res = await supabase
				.from('testimonials')
				.select('*, avatar(*)')
				.eq('userId', user.id)
				.range(from, to)
				.limit(limit)
				.order('createdAt', { ascending: false })

			return {
				data: {
					...pagination,
					count: res.count,
					data: res.data as TTestimonial[]
				},
				error: res.error
			}
		},
		async create(data: CreateSchema) {
			if (!user) {
				return {
					data: null,
					error: new Error('Unauthorized')
				}
			}

			const testimonial = await supabase
				.from('testimonials')
				.insert([
					{
						name: data.name,
						rating: data.rating,
						company: data.company,
						testimonial: data.testimonial,
						date: data.date?.toISOString(),
						avatar: data.avatar
					}
				])
				.select('*,avatar(*)')
				.single()

			if (testimonial.error) {
				return {
					data: null,
					error: new Error(testimonial.error.message)
				}
			}

			return {
				data: testimonial.data as TTestimonial,
				error: null
			}
		},
		async update(id: TId, data: CreateSchema) {
			if (!user) {
				return {
					data: null,
					error: new Error('Unauthorized')
				}
			}

			const testimonial = await supabase
				.from('testimonials')
				.update({
					name: data.name,
					rating: data.rating,
					company: data.company,
					testimonial: data.testimonial,
					date: data.date?.toISOString(),
					avatar: data.avatar
				})
				.eq('id', id)
				.select('*,avatar(*)')
				.single()

			if (testimonial.error) {
				return {
					data: null,
					error: new Error(testimonial.error.message)
				}
			}

			return {
				data: testimonial.data as TTestimonial,
				error: null
			}
		},
		async delete(...ids: TId[]) {
			const testimonial = await supabase
				.from('testimonials')
				.delete()
				.in('id', ids)
				.select('*,avatar(*)')

			if (testimonial.error) {
				return {
					data: [],
					error: new Error(testimonial.error.message)
				}
			}
			return {
				data: testimonial.data as TTestimonial[],
				error: null
			}
		}
	}
}

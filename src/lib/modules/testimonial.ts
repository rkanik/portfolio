import type { TPagination, TPublicContext, TUserTestimonial } from '$lib/types'
import { z } from 'zod'

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

const createSchema = z.object({
	name: z.string().min(1, 'Required.'),
	company: z.string().min(1, 'Required.'),
	testimonial: z.string().min(1, 'Required.'),
	rating: z.number().min(1).max(5),
	date: z.instanceof(Date).nullable(),
	avatar: z.object({
		src: z.string().nullable(),
		file: z.instanceof(typeof File !== 'undefined' ? File : Object).nullable()
	})
})

export type CreateSchema = z.infer<typeof createSchema>

export const useTestimonialModule = (context: TPublicContext) => {
	const { user, supabase } = context

	return {
		createSchema,
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
				.order('createdAt', { ascending: false })

			return {
				data: {
					...pagination,
					count: res.count,
					data: res.data as TUserTestimonial[]
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
						date: data.date?.toISOString()
					}
				])
				.select('*')
				.single()

			if (testimonial.error) {
				return {
					data: null,
					error: new Error(testimonial.error.message)
				}
			}

			const userTestimonial = await supabase
				.from('userTestimonials')
				.insert([{ testimonialId: testimonial.data.id, userId: user.id }])
				.select('*,testimonials(*)')
				.single()

			if (userTestimonial.error) {
				return {
					data: null,
					error: new Error(userTestimonial.error.message)
				}
			}

			return {
				data: userTestimonial.data as TUserTestimonial,
				error: null
			}
		}
	}
}

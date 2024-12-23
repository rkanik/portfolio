import type { AnyObject, TId, TPagination, TProject } from '$lib/types'

import slugify from 'slugify'

import { z } from 'zod'
import { toPaginated } from '$lib/utils/toPaginated'
import { getNewSortOrder } from '$lib/utils/getNewSortOrder'
import { getSupabasePagination } from '$lib/utils/getSupabasePagination'
import { useGlobalPageData, type TGlobalPageData } from '$lib/utils/useGlobalPageData'

type ListFilter = TPagination & {
	userId?: TId
	status?: 'active'
	name?: string
}

type Filter = {
	slug?: string
}

const createSchema = z.object({
	name: z.string().min(1, 'Required.'),
	userId: z.string().min(1, 'Required.')
})

const select = `
	*,
	projectAttachments:project_attachments(
		*,
		attachments(
			*
		)
	),
	projectTechnologies:project_technologies(
		*,
		technologies(
			*
		)
	)
`

const order = <T extends AnyObject>(query: T): T => {
	return (
		query
			// .order('createdAt', { ascending: false })
			.order('sortOrder', { ascending: true })
			.order('sortOrder', {
				ascending: true,
				foreignTable: 'project_attachments'
			})
			.order('sortOrder', {
				ascending: true,
				foreignTable: 'project_technologies'
			})
	)
}

export type CreateSchema = z.infer<typeof createSchema>

export const useProjects = (context?: TGlobalPageData) => {
	const { user, supabase } = context || useGlobalPageData()

	return {
		createSchema,
		async list(filter?: ListFilter) {
			const { from, to, limit, page, perPage } = getSupabasePagination(filter)

			const query = order(
				supabase.from('projects').select(select, { count: 'exact' }).range(from, to).limit(limit)
			)

			if (filter?.status) query.eq('status', filter.status)
			if (filter?.userId) query.eq('userId', filter.userId)
			if (filter?.name) query.ilike('name', `%${filter.name}%`)

			const response = await query
			// console.log(response.data, response.error)

			return {
				error: response.error,
				data: toPaginated({
					page,
					perPage,
					count: response.count,
					data: response.data as TProject[]
				})
			}
		},
		async get(filter?: Filter) {
			if (!user) {
				return {
					error: new Error('Unauthorized'),
					data: null
				}
			}

			const query = order(supabase.from('projects').select(select).eq('userId', user.id))

			if (filter?.slug) {
				query.eq('slug', filter.slug)
			}

			query.single()

			const { error, data } = await query
			if (error) return { error, data }

			return {
				error,
				data: data as unknown as TProject
			}
		},
		async create(data: CreateSchema) {
			const sortOrder = await getNewSortOrder({
				table: 'projects',
				add: -1,
				fallback: 1,
				ascending: false
			})

			const project = await order(
				supabase
					.from('projects')
					.insert([
						{
							sortOrder,
							name: data.name,
							userId: data.userId,
							slug: slugify(data.name)
						}
					])
					.select(select)
			).single()

			return {
				data: !project.error ? (project.data as TProject) : null,
				error: project.error
			}
		},
		async update(id: TId, update: Partial<TProject>) {
			const project = await order(
				supabase.from('projects').update(update).eq('id', id).select('*')
			).single()

			return {
				data: !project.error ? (project.data as TProject) : null,
				error: project.error
			}
		},
		async delete(...ids: TId[]) {
			const projects = await order(supabase.from('projects').delete().in('id', ids).select(select))
			return {
				data: !projects.error ? (projects.data as TProject[]) : [],
				error: projects.error
			}
		}
	}
}

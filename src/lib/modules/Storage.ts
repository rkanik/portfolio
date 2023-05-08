import type { TPagination, TPublicContext, TUserTestimonial } from '$lib/types'

type ListFilter = TPagination & {
	bucket?: string
	folder?: string
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

export type Bucket = {
	id: string
	name: string
	owner: string
	file_size_limit?: number
	allowed_mime_types?: string[]
	created_at: string
	updated_at: string
	public: boolean
}

export type FileObject = {
	name: string
	bucket_id: string
	owner: string
	id: string
	updated_at: string
	created_at: string
	last_accessed_at: string
	metadata: Record<string, any>
	buckets: Bucket
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

			const { bucket = 'uploads', folder = 'projects' } = filter || {}
			const uploads = await supabase.storage.from(bucket).list(folder, {
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

import type { TPagination } from '$lib/types'
import type { TGlobalPageData } from '$lib/utils/useGlobalPageData'

type ListFilter = TPagination & {
	bucket?: string
	folder?: string
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

export const useStorageModule = (context: Pick<TGlobalPageData, 'user' | 'supabase'>) => {
	const { user, supabase } = context

	return {
		async list(filter?: ListFilter) {
			if (!user) {
				return {
					data: [],
					error: new Error('Unauthorized')
				}
			}

			const { bucket = 'portfolio', folder = 'projects' } = filter || {}
			const storage = await supabase.storage.from(bucket).list(folder, {
				limit: 100,
				offset: 0,
				sortBy: {
					column: 'name',
					order: 'asc'
				}
			})

			return {
				data: storage.data,
				error: storage.error
			}
		}
	}
}

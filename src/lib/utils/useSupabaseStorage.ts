import { nanoid } from 'nanoid'
import type { SupabaseClient } from '@supabase/supabase-js'

export type SupabaseFile = {
	path: string
	bucket?: string
	file: File
}

const useSupabaseStorage = (supabase: SupabaseClient) => {
	return {
		async remove(paths: string[]) {
			if (!paths.length) {
				return { data: null, error: null }
			}
			const bucket = paths[0].split('/')[0]
			return supabase.storage.from(bucket).remove(
				paths.map((path) => {
					return path.substring(bucket.length + 1)
				})
			)
		},
		async upload(item: SupabaseFile) {
			const { file, path, bucket = 'uploads' } = item
			const ext = file.name.split('.').pop() || '.jpg'
			const { error, data } = await supabase.storage
				.from(bucket)
				.upload(`${path}/${nanoid().toLowerCase()}.${ext}`, file, {
					upsert: true,
					cacheControl: '3600'
				})
			return { file, error, data }
		},
		async uploadMany(files: SupabaseFile[]) {
			return await Promise.all(files.map(this.upload))
		}
	}
}

export default useSupabaseStorage

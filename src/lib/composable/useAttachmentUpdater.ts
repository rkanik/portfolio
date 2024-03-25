import type { TSupabase } from '$lib/types'

type Config = {
	supabase: TSupabase
}

export const useAttachmentUpdater = ({ supabase }: Config) => {
	const updateOne = async (id: string, file: File) => {
		const { error, data: attachment } = await supabase
			.from('attachments')
			.select('*')
			.eq('id', id)
			.single()

		if (error) {
			console.log(error)
			return {
				error,
				data: null
			}
		}

		const { data: fileObject } = await supabase.storage
			.from(attachment.bucket)
			.upload(`${attachment.folder}/${attachment.name}`, file, { upsert: true })

		return await supabase
			.from('attachments')
			.update({
				filename: file.name,
				mimeType: file.type,
				src: (fileObject?.path || '').split('/').pop() || ''
			})
			.eq('id', id)
			.select('*')
			.single()
	}
	return {
		updateOne
	}
}

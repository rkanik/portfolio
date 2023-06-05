import type { TAttachment, TSupabase } from '$lib/types'

import toValue from './toValue'
import { page } from '$app/stores'

export const getPublicUrl = (
	attachment?: TAttachment | null,
	type: 'thumbnail' | 'medium' | 'src' = 'thumbnail'
) => {
	if (!attachment) return `/img/fallback-image.webp`
	const name = type ? attachment[type] : attachment.thumbnail || attachment.medium || attachment.src
	const supabase = toValue(page).data.supabase as TSupabase
	return (
		supabase.storage.from(attachment.bucket).getPublicUrl(`${attachment.folder}/${name}`)?.data
			?.publicUrl || ''
	)
}

import { PUBLIC_SUPABASE_URL } from '$env/static/public'

const src = (src?: string | null) => {
	if (!src) return `/img/fallback-image.webp`
	if (src.startsWith('blob')) return src
	return PUBLIC_SUPABASE_URL + '/storage/v1/object/public/uploads/' + src
}

export default src

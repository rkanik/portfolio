import { PUBLIC_SUPABASE_URL } from '$env/static/public'

type Options = {
	bucket?: string
	folder?: string
}
const src = (src?: string | null, options?: Options) => {
	if (!src) return `/img/fallback-image.webp`
	if (src.startsWith('blob')) return src
	const { bucket = 'portfolio', folder = '' } = options || {}
	return [PUBLIC_SUPABASE_URL, 'storage/v1/object/public', bucket, folder, src]
		.filter(Boolean)
		.join('/')
}

export default src

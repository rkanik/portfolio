import { getOrPutCache } from '$lib/cache'

export const load = async (event) => {
	const { supabase, publicUser } = await event.locals.getContext()

	const testimonials = await getOrPutCache(['testimonials', publicUser.id], () => {
		return supabase.from('testimonials').select('*').eq('userId', publicUser.id)
	})

	return {
		testimonials
	}
}

import { getOrPutCache } from '$lib/cache/index.js'
import type { TProfile } from '$lib/types/Profile'

export const load = async ({ cookies, locals: { getContext } }) => {
	const { user, supabase } = await getContext()
	if (!user) {
		return {
			profile: null,
			userTechnologies: [],
			cookies: cookies.getAll()
		}
	}

	const profile = await getOrPutCache(['profiles', user.id], () => {
		return supabase.from('profiles').select('*').eq('id', user.id).single()
	})

	const userTechnologies = await getOrPutCache(['user_technologies', user.id], () => {
		return supabase.from('user_technologies').select('id,technologies(*)').eq('userId', user.id)
	})

	return {
		profile: profile.data as TProfile | null,
		userTechnologies: userTechnologies.data ?? [],
		cookies: cookies.getAll()
	}
}

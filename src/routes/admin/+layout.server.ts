import type { TProfile } from '$lib/types/Profile'

export const load = async ({ locals: { getContext } }) => {
	const { user, supabase } = await getContext()
	if (!user) {
		return {
			profile: null,
			userTechnologies: []
		}
	}

	const profile = await supabase.from('profiles').select('*').eq('id', user.id).single()

	const userTechnologies = await supabase
		.from('userTechnologies')
		.select('id,technologies(*)')
		.eq('userId', user.id)

	return {
		profile: profile.data as TProfile | null,
		userTechnologies: userTechnologies.data ?? []
	}
}

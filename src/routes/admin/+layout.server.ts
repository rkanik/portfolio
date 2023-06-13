export const load = async ({ locals: { getContext } }) => {
	const context = await getContext()

	const { supabase, user } = context

	if (!user) {
		return {
			userTechnologies: []
		}
	}

	const userTechnologies = await supabase
		.from('userTechnologies')
		.select('id,technologies(*)')
		.eq('userId', user.id)

	return {
		userTechnologies: userTechnologies.data ?? []
	}
}

export const load = async ({ locals: { getContext } }) => {
	const { user, supabase } = await getContext()

	if (!user) {
		return {
			projects: {
				data: [],
				error: new Error('Unauthorized')
			}
		}
	}

	return {
		projects: await supabase
			.from('projects')
			.select(
				`*,
				projectAttachments(
					*,attachments(*)
				),
				projectTechnologies(
					*,technologies(*)
				)`
			)
			.eq('userId', user.id)
			.order('sortOrder', { ascending: true })
	}
}

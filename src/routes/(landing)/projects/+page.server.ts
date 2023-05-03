export const load = async ({ locals: { user, supabase } }) => {
	const userTechnologies = await supabase
		.from('userTechnologies')
		.select('id,technologies(id,icon,name)')
		.eq('userId', user.id)

	return {
		userTechnologies,
		projects: await supabase
			.from('projects')
			.select(
				`*,
				projectAttachments(*,attachments(*)),
				projectTechnologies(id,technologies(id,name,icon))`
			)
			.eq('status', 'active')
			.order('sortOrder', { ascending: true })
	}
}

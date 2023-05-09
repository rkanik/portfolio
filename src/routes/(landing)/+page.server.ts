export const load = async ({ locals: { getContext } }) => {
	const { supabase, publicUser } = await getContext()

	const userTechnologies = await supabase
		.from('userTechnologies')
		.select('id,technologies(id,icon,name)')
		.eq('userId', publicUser.id)

	const userTestimonials = await supabase
		.from('userTestimonials')
		.select('*,testimonials(*)')
		.eq('userId', publicUser.id)

	return {
		userTechnologies,
		userTestimonials,
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

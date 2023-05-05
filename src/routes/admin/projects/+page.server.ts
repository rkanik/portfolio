export const load = async ({ locals: { supabase } }) => {
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
			.order('sortOrder', { ascending: true })
	}
}

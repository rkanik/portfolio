export const load = async ({ locals: { supabase } }) => {
	return {
		projects: await supabase
			.from('projects')
			.select(`*,projectAttachments(*,attachments(*))`)
			.order('sortOrder', { ascending: true })
	}
}

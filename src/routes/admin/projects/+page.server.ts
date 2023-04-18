export const load = async ({ locals: { supabase } }) => {
	return {
		projects: await supabase
			.from('projects')
			.select(`*,projectAttachments(*,attachments(*))`)
			.order('createdAt', { ascending: false })
	}
}

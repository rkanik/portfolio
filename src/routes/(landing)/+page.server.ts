export const load = async ({ locals: { supabase } }) => {
	return {
		projects: await supabase
			.from('projects')
			.select(`*,projectAttachments(*,attachments(*))`)
			.eq('status', 'active')
			.order('createdAt', { ascending: false })
	}
}

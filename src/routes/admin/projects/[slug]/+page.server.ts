import type { TProject } from '$lib/types'

export const load = async ({ params, locals: { supabase } }) => {
	const project = await supabase
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
		.eq('slug', params.slug)
		.single()
	return {
		project: project.data as TProject | null
	}
}

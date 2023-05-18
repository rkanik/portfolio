import type { TProject, TUserTechnology } from '$lib/types'
import { error as notFoundError } from '@sveltejs/kit'

export const load = async ({ params, locals: { getContext } }) => {
	const { supabase, publicUser } = await getContext()

	const userTechnologies = await supabase
		.from('userTechnologies')
		.select('*,technologies(*)')
		.eq('userId', publicUser.id)

	const { error, data: project } = await supabase
		.from('projects')
		.select(
			`*,
			projectAttachments(*,attachments(*)),
			projectTechnologies(id,technologies(*))`
		)
		.eq('status', 'active')
		.eq('slug', params.slug)
		.single()

	if (error || !project) {
		throw notFoundError(404, {
			message: 'Project Not Found!'
		})
	}

	const projects = ((
		await supabase
			.from('projects')
			.select(
				`*,
				projectAttachments(*,attachments(*)),
				projectTechnologies(id,technologies(*))`
			)
			.eq('status', 'active')
			.neq('id', project.id)
			.order('sortOrder', { ascending: true })
	).data || []) as TProject[]

	return {
		projects,
		project: project as TProject,
		userTechnologies: (userTechnologies.data || []) as TUserTechnology[]
	}
}

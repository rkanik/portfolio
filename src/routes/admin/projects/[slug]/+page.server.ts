import type { TProject, TUserTechnology } from '$lib/types'

export const load = async ({ params, locals: { getContext } }) => {
	const { session, supabase } = await getContext()

	if (!session) {
		return {
			project: null,
			userTechnologies: []
		}
	}

	const userTechnologies = ((
		await supabase
			.from('userTechnologies')
			.select('id,technologies(id,icon,name)')
			.eq('userId', session.user.id)
	)?.data || []) as TUserTechnology[]

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
		.eq('userId', session.user.id)
		.single()

	return {
		userTechnologies,
		project: project.data as TProject | null
	}
}

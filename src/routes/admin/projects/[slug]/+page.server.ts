import { useProjects } from '$lib/modules/Projects'
import type { TUserTechnology } from '$lib/types'

export const load = async ({ params, locals: { getContext } }) => {
	const context = await getContext()
	const Projects = useProjects(context)

	const { error, data: project } = await Projects.get({
		slug: params.slug
	})

	const fallback = {
		error,
		project: null,
		userTechnologies: []
	}

	if (!context.user || error) {
		return { ...fallback }
	}

	const userTechnologies = ((
		await context.supabase
			.from('userTechnologies')
			.select('id,technologies(id,icon,name)')
			.eq('userId', context.user.id)
	)?.data || []) as TUserTechnology[]

	return {
		error,
		project,
		userTechnologies
	}
}

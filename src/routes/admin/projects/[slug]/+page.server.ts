import type { TTechnology } from '$lib/types'

import { useProjects } from '$lib/modules/Projects'

export const load = async ({ params, locals: { getContext } }) => {
	const context = await getContext()
	const Projects = useProjects(context)

	// console.log('server', params.slug)
	const { error, data: project } = await Projects.get({
		slug: params.slug
	})

	const fallback = {
		error,
		project: null,
		technologies: [] as TTechnology[]
	}

	if (!context.user || error) {
		return { ...fallback }
	}

	const technologies = (
		(
			await context.supabase
				.from('user_technologies')
				.select('id,technologies(*)')
				.eq('userId', context.user.id)
		)?.data || []
	).map((v) => v.technologies) as TTechnology[]

	return {
		error,
		project,
		technologies
	}
}

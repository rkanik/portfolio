import type { TProject } from '$lib/types'

import { useProjects } from '$lib/modules/Projects'
import { toPaginated } from '$lib/utils/toPaginated'

export const load = async ({ locals: { getContext } }) => {
	const ctx = await getContext()
	if (!ctx.user)
		return {
			error: null,
			projects: toPaginated<TProject>()
		}

	const Projects = useProjects(ctx)
	const { error, data: projects } = await Projects.list({
		perPage: 50,
		userId: ctx.user.id
	})

	return { error, projects }
}

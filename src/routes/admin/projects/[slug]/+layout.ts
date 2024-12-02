import type { TProject } from '$lib/types'
import { useProjects } from '$lib/modules/Projects'
import { toPaginated } from '$lib/utils/toPaginated'

export const load = async (event) => {
	const ctx = await event.parent()

	if (!ctx.user) {
		return {
			error: null,
			projects: toPaginated<TProject>()
		}
	}

	const Projects = useProjects(ctx)
	const { error, data: projects } = await Projects.list({
		perPage: 100,
		userId: ctx.user.id
	})

	return {
		error,
		projects
	}
}

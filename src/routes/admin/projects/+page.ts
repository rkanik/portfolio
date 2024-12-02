import type { TProject } from '$lib/types'
import { useProjects } from '$lib/modules/Projects'
import { toPaginated } from '$lib/utils/toPaginated'

export const load = async ({ url, parent }) => {
	const ctx = await parent()

	if (!ctx.user) {
		return {
			error: null,
			projects: toPaginated<TProject>()
		}
	}

	const Projects = useProjects(ctx)
	const { error, data: projects } = await Projects.list({
		perPage: +(url.searchParams.get('per-page') || 100),
		userId: ctx.user.id
	})

	return {
		error,
		projects
	}
}

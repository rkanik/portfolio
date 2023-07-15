import { getOrPutCache } from '$lib/cache'
import { useProjects } from '$lib/modules/Projects'

export const config = {
	isr: {
		expiration: 60
	}
}

export const load = async (event) => {
	const context = await event.locals.getContext()
	const Projects = useProjects(context)

	const projects = await getOrPutCache(
		['projects', 1, 1000, 'active', context.publicUser.id],
		() => {
			return Projects.list({
				page: 1,
				perPage: 1000,
				status: 'active',
				userId: context.publicUser.id
			})
		}
	)

	return {
		projects
	}
}

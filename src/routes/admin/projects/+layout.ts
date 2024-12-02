import { prefetchProjectsQuery } from '$lib/queries/createProjectsQuery'

export const load = async (event) => {
	const ctx = await event.parent()
	await prefetchProjectsQuery(ctx)
	return {
		//
	}
}

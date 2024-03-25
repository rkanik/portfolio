import type { TUserTechnology } from '$lib/types.js'

import { getOrPutCache } from '$lib/cache'
import { useProjects } from '$lib/modules/Projects'

export const load = async (event) => {
	const context = await event.locals.getContext()
	const Projects = useProjects(context)

	const { supabase, publicUser } = context
	const { data: userTechnologies = [] } = await getOrPutCache(
		['userTechnologies', publicUser.id],
		async () => {
			return (await supabase
				.from('userTechnologies')
				.select('*,technologies(*)')
				.eq('userId', publicUser.id)) as {
				error: null | Error
				data: null | TUserTechnology[]
			}
		}
	)

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
		projects,
		userTechnologies
	}
}

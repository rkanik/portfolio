import { getOrPutCache } from '$lib/cache'
import { useProjects } from '$lib/modules/Projects'

export const load = async (event) => {
	const context = await event.locals.getContext()
	const Projects = useProjects(context)

	const { supabase, publicUser } = context

	const userTechnologies = await getOrPutCache(['userTechnologies', publicUser.id], () => {
		return supabase.from('userTechnologies').select('*,technologies(*)').eq('userId', publicUser.id)
	})

	const projects = await getOrPutCache(['projects', 1, 1000, 'active', publicUser.id], () => {
		return Projects.list({
			page: 1,
			perPage: 1000,
			status: 'active',
			userId: publicUser.id
		})
	})

	return {
		userTechnologies,
		projects
	}
}

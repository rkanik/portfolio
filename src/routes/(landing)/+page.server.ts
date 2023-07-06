import { getOrPutCache } from '$lib/cache'
import { useProjects } from '$lib/modules/Projects'

export const load = async (event) => {
	const context = await event.locals.getContext()
	const Projects = useProjects(context)

	const { supabase, publicUser } = context

	const userTechnologies = await getOrPutCache(['userTechnologies', publicUser.id], () => {
		return supabase
			.from('userTechnologies')
			.select('id,technologies(id,icon,name)')
			.eq('userId', publicUser.id)
	})

	const testimonials = await getOrPutCache(['testimonials', publicUser.id], () => {
		return supabase.from('testimonials').select('*,avatar(*)').eq('userId', publicUser.id)
	})

	const projects = await getOrPutCache('projects', () => Projects.list())

	return {
		testimonials,
		userTechnologies,
		projects
	}
}

import { getOrPutCache } from '$lib/cache'
import { useProjects } from '$lib/modules/Projects'

export const load = async (event) => {
	const context = await event.locals.getContext()
	const Projects = useProjects(context)

	const { supabase, publicUser } = context

	const userTechnologies = await getOrPutCache(['userTechnologies', publicUser.id], () => {
		return supabase
			.from('user_technologies')
			.select('id,technologies(id,icon,name)')
			.eq('userId', publicUser.id)
	})

	// const testimonials = await supabase.from('testimonials').select('*').eq('userId', publicUser.id)
	const testimonials = await getOrPutCache(['testimonials', publicUser.id], () => {
		return supabase.from('testimonials').select('*').eq('userId', publicUser.id)
		// return supabase.from('testimonials').select('*,avatar(*)').eq('userId', publicUser.id)
	})

	// const projects = await Projects.list()
	// console.log(projects.error)
	const projects = await getOrPutCache('projects', () => Projects.list())

	return {
		testimonials,
		userTechnologies,
		projects
	}
}

import { useProjects } from '$lib/modules/Projects'

export const load = async ({ locals: { getContext } }) => {
	const context = await getContext()

	const { supabase, publicUser } = context
	const userTechnologies = await supabase
		.from('userTechnologies')
		.select('id,technologies(id,icon,name)')
		.eq('userId', publicUser.id)

	const testimonials = await supabase
		.from('testimonials')
		.select('*,avatar(*)')
		.eq('userId', publicUser.id)

	const Projects = useProjects(context)

	return {
		testimonials,
		userTechnologies,
		projects: await Projects.list()
	}
}

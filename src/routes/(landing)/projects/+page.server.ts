import { useProjects } from '$lib/modules/Projects'

export const load = async ({ locals: { getContext } }) => {
	const context = await getContext()
	const Projects = useProjects(context)

	const { supabase, publicUser } = context
	const userTechnologies = await supabase
		.from('userTechnologies')
		.select('*,technologies(*)')
		.eq('userId', publicUser.id)

	return {
		userTechnologies,
		projects: await Projects.list({
			page: 1,
			perPage: 1000,
			status: 'active',
			userId: publicUser.id
		})
	}
}

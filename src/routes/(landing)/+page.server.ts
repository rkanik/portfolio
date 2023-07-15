import type { TUserTechnology } from '$lib/types'

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

	const { supabase, publicUser } = context

	const userTechnologies = await getOrPutCache(['userTechnologies', publicUser.id], async () => {
		return (await supabase
			.from('userTechnologies')
			.select('*,technologies(*)')
			.eq('userId', publicUser.id)) as {
			data: TUserTechnology[]
		}
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

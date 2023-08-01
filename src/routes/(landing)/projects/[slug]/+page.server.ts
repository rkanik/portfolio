import type { TProject, TUserTechnology } from '$lib/types'
import { error as notFoundError } from '@sveltejs/kit'

export const config = {
	isr: {
		expiration: 60
	}
}

export const load = async ({ params, locals: { getContext } }) => {
	const context = await getContext()

	const { error, data: project } = await context.supabase
		.from('projects')
		.select(
			`*,
			projectAttachments(*,attachments(*)),
			projectTechnologies(id,technologies(*))`
		)
		.eq('status', 'active')
		.eq('slug', params.slug)
		.single()

	if (error || !project) {
		throw notFoundError(404, {
			message: 'Project Not Found!'
		})
	}

	return {
		project: project as TProject
	}
}

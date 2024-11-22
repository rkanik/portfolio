import { trpc } from '$lib/trpc/client'
import { getTechnologyPostForm } from '@/lib/modules/technologies/form'

export const load = async (event) => {
	const { queryClient } = await event.parent()
	const api = trpc(event, queryClient)
	return {
		api,
		form: await getTechnologyPostForm(),
		technologies: await api.technologies.get.createServerQuery(),
	}
}

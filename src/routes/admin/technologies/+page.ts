import { trpc } from '$lib/trpc/client'

export const load = async (event) => {
	const { queryClient } = await event.parent()
	const api = trpc(event, queryClient)
	return {
		api,
		technologies: await api.technologies.get.createServerQuery(),
	}
}

import { page } from '$app/stores'
import type { TSupabase } from '$lib/types'
import getStoreValue from '$lib/utils/getStoreValue'
import { useGlobalPageData } from '$lib/utils/useGlobalPageData'
import { createQuery, type QueryClient } from '@tanstack/svelte-query'

const fetchProjects = async (event: { supabase: TSupabase }) => {
	return event.supabase
		.from('projects')
		.select(
			`*,
			projectAttachments:project_attachments(
				*,
				attachments(*)),
			projectTechnologies:project_technologies(
				*,
				technologies(*))`
		)
		.order('sortOrder', { ascending: true })
}

export const createProjectsQuery = () => {
	const { supabase } = useGlobalPageData()
	return createQuery({
		queryKey: ['createProjectsQuery'],
		queryFn: () => fetchProjects({ supabase })
	})
}

export const prefetchProjectsQuery = (ctx: { queryClient: QueryClient; supabase: TSupabase }) => {
	return ctx.queryClient.prefetchQuery({
		queryKey: ['createProjectsQuery'],
		queryFn: () => fetchProjects({ supabase: ctx.supabase })
	})
}

export const invalidateProjectsQuery = () => {
	return getStoreValue(page).data.queryClient.invalidateQueries({
		queryKey: ['createProjectsQuery']
	})
}

import type { TSupabase } from '$lib/types'

const getLastOrderProjects = async (supabase: TSupabase) => {
	const res = await supabase
		.from('projects')
		.select('sortOrder')
		.order('sortOrder', { ascending: false })
		.limit(1)
		.single()
	return res.data?.sortOrder || 1
}

const Project = {
	getLastOrderProjects
}

export default Project

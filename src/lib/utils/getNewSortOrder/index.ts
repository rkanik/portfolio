import { useGlobalPageData, type TGlobalPageData } from '../useGlobalPageData'

export const getNewSortOrder = async (options: {
	table: 'projects' | 'testimonial' | 'projectAttachments' | 'projectTechnologies'
	add?: number
	fallback?: number
	ascending?: boolean
	context?: TGlobalPageData
}) => {
	const { table, context, ascending = true, fallback = 1, add = 1 } = options
	const { supabase } = context || useGlobalPageData()

	const { error, data } = await supabase
		.from(table)
		.select('*')
		.order('sortOrder', { ascending })
		.limit(1)

	if (error) return fallback
	return typeof data[0].sortOrder === 'number' ? data[0].sortOrder + add : fallback
}

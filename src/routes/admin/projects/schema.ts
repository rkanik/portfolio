import { z } from 'zod'

export type TZPostProject = typeof zPostProject
export const zPostProject = z.object({
	username: z
		.string()
		.min(1, 'Required.')
		.max(10, 'Must be 10 characters or less.'),
})

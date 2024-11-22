import { z } from 'zod'

export type TZPostTechnology = z.infer<typeof zPostTechnology>
export const zPostTechnology = z.object({
	id: z.string().nullish(),
	name: z.string().min(1),
	icon: z.string().min(1),
	color: z.string().min(1),
})

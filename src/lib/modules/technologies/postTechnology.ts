import type { TZPostTechnology } from './zod'
import { prisma } from '@/lib/prisma'

export const postTechnology = async ({ id, ...data }: TZPostTechnology) => {
	if (id) {
		return prisma.technologies.update({
			data,
			where: {
				id,
			},
		})
	}
	return prisma.technologies.create({
		data,
	})
}

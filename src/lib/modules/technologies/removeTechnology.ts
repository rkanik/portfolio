import { prisma } from '@/lib/prisma'

export const removeTechnology = (id: string) => {
	return prisma.technologies.delete({
		where: {
			id,
		},
	})
}

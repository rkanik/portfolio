import { prisma } from '$lib/prisma'

export const getTechnologies = async () => {
	return prisma.technologies.findMany({
		//
	})
}

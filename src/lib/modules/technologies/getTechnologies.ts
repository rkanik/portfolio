import { prisma } from '$lib/prisma'

export const getTechnologies = async () => {
	return prisma.technologies.findMany({
		//
	})
}

export type TTechnologies = Awaited<ReturnType<typeof getTechnologies>>
export type TTechnology = TTechnologies[number]

import type { TProject, TTestimonial, TUserTechnology } from '$lib/types'
import { getOrPutCache } from '$lib/cache'
import { useProjects } from '$lib/modules/Projects'
import { prisma } from '@/lib/prisma.js'
import { toPaginated } from '@/lib/utils/toPaginated/index.js'

export const config = {
	isr: {
		expiration: 60,
	},
}

export const load = async (event) => {
	const context = await event.locals.getContext()
	const Projects = useProjects(context)

	const { supabase, publicUser } = context

	const userTechnologies = await getOrPutCache(
		['userTechnologies', publicUser.id],
		async () => {
			return (await supabase
				.from('user_technologies')
				.select('*,technologies(*)')
				.eq('userId', publicUser.id)) as {
				error: null | Error
				data: null | TUserTechnology[]
			}
		},
		{
			ignoreCache: true,
		},
	)

	const testimonials = await getOrPutCache(
		['testimonials', publicUser.id],
		async () => {
			return {
				data: (await prisma.testimonial.findMany({
					where: {
						userId: publicUser.id,
					},
					// include: {
					// 	ava: true,
					// },
				})) as unknown as TTestimonial[],
			}
			// return supabase
			// 	.from('testimonials')
			// 	.select('*,avatar(*)')
			// 	.eq('userId', publicUser.id)
		},
		// {
		// 	ignoreCache: true,
		// },
	)

	const projects = await getOrPutCache(
		'projects',
		async () => {
			return {
				data: toPaginated<TProject>({
					data: (await prisma.project.findMany({
						include: {
							projectAttachments: {
								include: {
									attachment: true,
								},
							},
							projectTechnologies: {
								include: {
									technology: true,
								},
							},
						},
					})) as any,
				}),
			}
		},
		// { ignoreCache: true },
	)

	return {
		testimonials,
		userTechnologies,
		projects,
	}
}

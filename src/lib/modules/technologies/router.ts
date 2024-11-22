import { getTechnologies } from './getTechnologies'
import { removeTechnology } from './removeTechnology'
import { t } from '$lib/trpc/t'
import { z } from 'zod'

export const technologiesRouter = t.router({
	get: t.procedure.query(() => {
		return getTechnologies()
	}),
	remove: t.procedure.input(z.string()).mutation(({ input }) => {
		return removeTechnology(input)
	}),
})

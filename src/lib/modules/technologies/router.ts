import { getTechnologies } from './getTechnologies'
import { t } from '$lib/trpc/t'

export const technologiesRouter = t.router({
	get: t.procedure.query(() => {
		return getTechnologies()
	}),
})

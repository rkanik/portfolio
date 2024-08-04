import type { RequestEvent } from '@sveltejs/kit'
import { t } from './t'
import { technologiesRouter } from '@modules/technologies/router'

export const router = t.router({
	technologies: technologiesRouter,
	greeting: t.procedure.query(async () => {
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`
	}),
})

const factory = t.createCallerFactory(router)
export const createCaller = async (event: RequestEvent) => {
	return factory(event.locals)
}

export type Router = typeof router

import { zPostProject } from './schema'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

export const load = async () => {
	return {
		form: await superValidate(zod(zPostProject)),
	}
}

export const actions = {
	async post(event) {
		const form = await superValidate(event, zod(zPostProject))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}
		return {
			form,
		}
	},
}

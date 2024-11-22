import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { postTechnology } from '@/lib/modules/technologies/postTechnology.js'
import { zPostTechnology } from '@/lib/modules/technologies/zod'

export const load = async () => {
	return {
		//
	}
}

export const actions = {
	post: async (event) => {
		const form = await superValidate(event, zod(zPostTechnology))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}
		try {
			const data = await postTechnology(form.data)
			return {
				data,
				form,
			}
		} catch (error) {
			console.log(JSON.stringify(error))
			return fail(400, {
				form,
				error: error.message,
			})
		}
	},
}

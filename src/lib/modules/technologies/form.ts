import { zPostTechnology } from './zod'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

export const getTechnologyPostForm = () => {
	return superValidate(zod(zPostTechnology))
}

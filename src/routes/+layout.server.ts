import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
	locals: { getSession, getContext },
	cookies,
}) => {
	const { session } = await getSession()
	const { publicUser } = await getContext()
	return {
		session,
		publicUser,
		cookies: cookies.getAll(),
	}
}

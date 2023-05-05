export const load = async ({ locals: { getContext } }) => {
	const context = await getContext()
	return {
		publicUser: context.publicUser,
		session: context.session
	}
}

export const actions = {
	async fixUser(event) {
		const ctx = await event.locals.getContext()

		const { data } = await ctx.supabase.auth.getUser()
		if (!data?.user) {
			return {
				error: 'User not found'
			}
		}

		const res = await ctx.supabase.auth.admin.updateUserById(data.user.id, {
			app_metadata: {
				superuser: true
			}
		})

		console.log(res.data.user?.app_metadata)
	}
}

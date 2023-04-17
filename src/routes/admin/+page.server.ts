// import { redirect } from '@sveltejs/kit'
// import type { Actions } from './$types'

// export const actions = {
// 	login: async ({ request, locals: { supabase } }) => {
// 		const formData = await request.formData()

// 		const email = formData.get('email') as string
// 		const password = formData.get('password') as string

// 		// // const signUp = await supabase.auth.signUp({
// 		// // 	email,
// 		// // 	password
// 		// // })

// 		// await supabase.auth.updateUser({ password })

// 		const signIn = await supabase.auth.signInWithPassword({ email, password })
// 		return signIn.data
// 	},
// 	logout: async ({ locals: { supabase, getSession } }) => {
// 		const session = await getSession()
// 		if (session) await supabase.auth.signOut()
// 		throw redirect(303, '/admin')
// 	}
// } satisfies Actions

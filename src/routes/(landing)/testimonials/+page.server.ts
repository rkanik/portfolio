export const load = async ({ locals: { getContext } }) => {
	const { supabase, publicUser } = await getContext()

	const testimonials = await supabase
		.from('testimonials')
		.select('*,avatar(*)')
		.eq('userId', publicUser.id)

	return {
		testimonials
	}
}

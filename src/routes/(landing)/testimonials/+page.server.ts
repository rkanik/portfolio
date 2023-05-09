export const load = async ({ locals: { getContext } }) => {
	const { supabase, publicUser } = await getContext()

	const userTestimonials = await supabase
		.from('userTestimonials')
		.select('*,testimonials(*)')
		.eq('userId', publicUser.id)

	return {
		userTestimonials
	}
}

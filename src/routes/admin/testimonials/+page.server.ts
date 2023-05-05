import { createTestimonialModule } from '$lib/modules/testimonial'

export const load = async ({ locals: { getContext } }) => {
	const context = await getContext()
	const Testimonial = createTestimonialModule(context)

	return {
		testimonials: await Testimonial.list()
	}
}

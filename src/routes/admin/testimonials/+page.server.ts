import { useTestimonialModule } from '$lib/modules/testimonial'

export const load = async ({ locals: { getContext } }) => {
	const context = await getContext()
	const Testimonial = useTestimonialModule(context)

	return {
		testimonials: await Testimonial.list()
	}
}

import { useTestimonialModule } from '$lib/modules/testimonial'

export const load = async ({ locals: { getContext } }) => {
	const Testimonial = useTestimonialModule(await getContext())
	return {
		testimonials: await Testimonial.list()
	}
}

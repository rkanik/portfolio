import { useTestimonialModule } from '$lib/modules/testimonial'

export const load = async () => {
	const Testimonial = useTestimonialModule()
	return {
		testimonials: await Testimonial.list()
	}
}

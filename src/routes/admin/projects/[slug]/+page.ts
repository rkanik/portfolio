export const load = async (event) => {
	// console.log('client', event.params.slug)
	return {
		error: event.data.error,
		project: event.data.project,
		technologies: event.data.technologies
	}
}

type Options = {
	excludeMax?: boolean
}

const random = (max: number, min = 0, options?: Options) => {
	min = Math.ceil(min)
	max = Math.floor(max)

	const { excludeMax = true } = options | {}

	return Math.floor(Math.random() * (max - min + (excludeMax ? 0 : 1)) + min)
}

export default random

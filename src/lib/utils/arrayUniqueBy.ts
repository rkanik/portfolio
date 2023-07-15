export const arrayUniqueBy = <T>(arr: T[], key: keyof T) => {
	return [
		...new Map(
			arr.map((item) => {
				return [item[key], item]
			})
		).values()
	]
}

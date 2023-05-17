const debounce = <T = unknown>(callback: (...args: T[]) => void, wait: number) => {
	let timeout: any = null
	return (...args: T[]) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			callback(...args)
		}, wait)
	}
}

export default debounce

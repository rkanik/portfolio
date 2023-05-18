const useRequestFullscreen = (
	el: HTMLElement | (() => HTMLElement),
	options?: FullscreenOptions
) => {
	return {
		show() {
			el = typeof el === 'function' ? el() : el
			return el.requestFullscreen(options)
		},
		hide() {
			document.exitFullscreen()
		}
	}
}

export default useRequestFullscreen

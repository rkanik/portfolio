const dataURLtoFile = (dataURL?: string | null | File, filename = Date.now().toString()) => {
	if (!dataURL) return null
	if (dataURL instanceof File) return dataURL

	const arr = dataURL.split(','),
		mime = arr[0].match(/:(.*?);/)?.[1],
		bstr = window.atob(arr[1])

	let n = bstr.length
	const u8arr = new Uint8Array(n)

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}

	return new File([u8arr], filename, { type: mime })
}

export default dataURLtoFile

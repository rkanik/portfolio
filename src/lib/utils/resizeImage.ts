type Options = {
	maxWidth?: number
	maxHeight?: number
}

export type ResizeImage = typeof resizeImage
export const resizeImage = (file: File, options?: Options) => {
	return new Promise<string | null>((resolve) => {
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			return resolve(null)
		}

		const img = document.createElement('img')
		img.setAttribute('src', URL.createObjectURL(file))

		img.addEventListener('load', () => {
			const canvas = document.createElement('canvas')
			let ctx = canvas.getContext('2d')
			if (ctx) ctx.drawImage(img, 0, 0)

			const maxWidth = options?.maxWidth || options?.maxHeight || 3
			const maxHeight = options?.maxHeight || options?.maxWidth || 3

			let width = img.width
			let height = img.height

			if (width > height) {
				if (width > maxWidth) {
					height *= maxWidth / width
					width = maxWidth
				}
			} else {
				if (height > maxHeight) {
					width *= maxHeight / height
					height = maxHeight
				}
			}

			canvas.width = width
			canvas.height = height

			ctx = canvas.getContext('2d')
			if (ctx) ctx.drawImage(img, 0, 0, width, height)

			return resolve(canvas.toDataURL(file.type))
		})
	})
}

export const resizeImages = (files: FileList | File[], options?: Options) => {
	return Promise.all(
		Array.from(files).map((file) => {
			return resizeImage(file, options)
		})
	)
}

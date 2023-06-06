type Options = {
	maxWidth?: number
	maxHeight?: number
}

const getResized = (width: number, height: number, maxWidth?: number, maxHeight?: number) => {
	maxWidth = maxWidth || maxHeight || 0
	maxHeight = maxHeight || maxWidth || 0

	if (width > height) {
		if (width > maxWidth) {
			// height *= maxWidth / width
			height = Math.round((height *= maxWidth / width))
			width = maxWidth
		}
	} else {
		if (height > maxHeight) {
			// width *= maxHeight / height
			width = Math.round((width *= maxHeight / height))
			height = maxHeight
		}
	}

	return [width, height] as const
}

export type ResizeImage = typeof resizeImage
export const resizeImage = (file: File, options?: Options) => {
	return new Promise<string>((resolve, reject) => {
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			return reject('Your browser does not support File API')
		}

		const img = document.createElement('img')
		img.setAttribute('src', URL.createObjectURL(file))

		img.addEventListener('load', () => {
			const canvas = document.createElement('canvas')

			// let ctx = canvas.getContext('2d')
			// if (ctx) ctx.drawImage(img, 0, 0)

			const [width, height] = getResized(
				img.width,
				img.height,
				options?.maxWidth,
				options?.maxHeight
			)

			canvas.width = width
			canvas.height = height

			const ctx = canvas.getContext('2d')
			if (ctx) ctx.drawImage(img, 0, 0, width, height)

			return resolve(canvas.toDataURL('image/webp', 1))
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

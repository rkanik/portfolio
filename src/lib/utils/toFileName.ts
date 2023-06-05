import genUUID from './uuid'

type Options = {
	prefix?: string
	postfix?: string
	uuid?: boolean | string
}
export const toFileName = (filename: string, options?: Options) => {
	const { postfix = '', prefix = '' } = options || {}

	const dotted = filename.split('.')
	const ext = dotted.pop()

	let { uuid } = options || {}
	uuid = uuid === false ? dotted.join('.') : uuid || genUUID()

	return `${prefix}${uuid}${postfix}.${ext}`
}

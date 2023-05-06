import { validator } from '@felte/validator-zod'
import { createForm } from 'felte'
import { z } from 'zod'
import type { ZodSchema } from 'zod'

type TTextField = {
	type: 'text' | 'email' | 'password' | 'tel'
	name: string
	label?: string
	placeholder?: string
}

type TDateField = {
	type: 'date'
	name: string
	label?: string
	placeholder?: string
}

type TField = TTextField | TDateField

type FormConfig<Schema> = {
	schema?: Schema
	fields?: TField[]
	initialValues: Partial<Schema>
}

// type BaseForm = ReturnType<typeof createBaseForm> & {
// 	fields: TField[]
// }

export const createBaseForm = <Schema extends ZodSchema>(config?: FormConfig<Schema>) => {
	const { fields = [], schema = z.object({}), initialValues = {} } = config || {}

	const form = createForm({
		initialValues,
		extend: validator({ schema })
	})

	return {
		...form,
		fields
	}
}

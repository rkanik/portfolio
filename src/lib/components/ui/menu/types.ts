import { ComponentType } from 'svelte'

export type TMenuItem = {
	text?: string
	href?: string
	exact?: boolean
	title?: string
	icon?: ComponentType
	children?: TMenuItem[]
}

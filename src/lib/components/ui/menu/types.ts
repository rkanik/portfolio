import { ComponentType } from "svelte"

export type TMenuItem = {
	text?: string
	href?: string
	icon?: ComponentType
	title?: string
	children?: TMenuItem[]
}

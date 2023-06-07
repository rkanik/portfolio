import type { Writable } from 'svelte/store'

export const anonymous = () => {
	//
}

export function removeNode(node: Element) {
	if (node.parentElement !== null) {
		node.parentElement.removeChild(node)
	}
}

export function insertNodeAt(fatherNode: Element, node: Element, position: number) {
	const refNode =
		position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling
	fatherNode.insertBefore(node, refNode)
}

export function getStoreValue<T>(store: Writable<T>): T {
	let value
	store.subscribe(($store) => (value = $store))()
	return value as T
}

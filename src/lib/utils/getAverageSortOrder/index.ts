type SortableItem = Record<string, unknown> & {
	sortOrder: number
}

export const getAverageSortOrder = <Item extends SortableItem>(items: Item[], index: number) => {
	const item = items[index]

	const prevSortOrder = index > 0 ? items[index - 1].sortOrder : items[index + 1].sortOrder - 1
	const nextSortOrder =
		index < items.length - 1 ? items[index + 1].sortOrder : items[index - 1].sortOrder + 1

	const sortOrder = Math.fround((prevSortOrder + nextSortOrder) / 2)
	item.sortOrder = sortOrder

	return {
		item,
		sortOrder
	}
}

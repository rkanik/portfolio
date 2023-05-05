<script lang="ts">
	import { onMount } from 'svelte'
	import Sortable from 'sortablejs'

	export let items: any[] = []

	let sortable
	let el: HTMLDivElement

	onMount(() => {
		sortable = new Sortable(el?.children[0], {
			animation: 150,
			// filter: '.disabled',
			// onUpdate: () => {
			// 	console.log('onUpdate', sortable.toArray())
			// },
			setData: { items },
			onMove(evt: any) {
				return ![evt.dragged, evt.related].some((el) => {
					return ['0', 'false'].includes(el?.getAttribute('data-draggable'))
				})
			},
			onSort: (evt) => {
				// console.log('onEnd', sortable.toArray())
				// let newIndex;
				// console.log(evt)
				// console.log('previousElementSibling', evt.item.previousElementSibling)
				// console.log('nextElementSiblingElementSibling', evt.item.nextElementSiblingElementSibling)
				// console.log('oldIndex', evt.oldIndex)
				// console.log('newIndex', evt.newIndex)
				// let neighborIndex
				// sortOrder.splice(sortOrder.indexOf(evt.item.id), 1) // stergem pe ala pe care l-am tras de sus
				// if (evt.oldIndex < evt.newIndex)
				// 	neighborIndex = sortOrder.indexOf(evt.item.previousElementSibling.id) + 1
				// else neighborIndex = sortOrder.indexOf(evt.item.nextElementSibling.id)
				// sortOrder.splice(neighborIndex, 0, evt.item.id) // il adaugam dupa vecin
				// console.log(sortOrder)

				// setTimeout(() => {
				// 	items = sortable
				// 		.toArray()
				// 		.map((id: string) => {
				// 			return items.find((item) => item.id === id)
				// 		})
				// 		.filter(Boolean)
				// }, 500)

				const item = items[evt.oldIndex]
				items.splice(evt.oldIndex, 1)
				items.splice(evt.newIndex, 0, item)
				items = [...items]

				sortable.option('setData', { items })

				// // items = [
				// // 	...items.slice(0, evt.newIndex),
				// // 	items[evt.oldIndex],
				// // 	items[evt.newIndex],
				// // 	...items.slice(evt.oldIndex + 1)
				// // ]
				// console.log(items.map((v) => v.id).toString())
			}
		})

		console.log(sortable)
		// sortable.setData(items)
	})
</script>

<div bind:this={el}>
	<slot />
</div>

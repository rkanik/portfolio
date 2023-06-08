<script lang="ts">
	import type { Nullable, TId, TTechnology } from '$lib/types'

	import { useDebounceFn } from 'sveltuse'

	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	import Div from './Div.svelte'
	import BaseModal from './base/BaseModal.svelte'

	const toSelectedArray = (selected: Nullable<TId> | TId[]) => {
		if (Array.isArray(selected)) return selected
		if (selected !== null) return [selected]
		return []
	}

	export let modal = false
	export let inline = true

	export let multiple = true

	export let selected: Nullable<TId> | TId[] = multiple ? [] : null
	export let innerSelected = toSelectedArray(selected)
	export let newlySelected: TId[] = []

	export let technologies: TTechnology[]

	let innerTechnologies = technologies.filter((v) => {
		return !innerSelected.includes(v.id)
	})
	let innerTechnologiesCopied = [...innerTechnologies]

	let search = ''
	const onInputSearch = useDebounceFn(() => {
		innerTechnologies = search.trim()
			? innerTechnologiesCopied.filter((v) => {
					return (
						newlySelected.includes(v.id) ||
						v.name.trim().toLowerCase().includes(search.trim().toLowerCase())
					)
			  })
			: [...innerTechnologiesCopied]
	}, 300)

	const reset = () => {
		search = ''
		onInputSearch()
		newlySelected = []
		modal = false
	}

	export let onSelect: (
		selected: TTechnology | TTechnology[],
		ctx: {
			reset: () => void
		}
	) => void = () => {
		//
	}

	const onClickSelect: any = () => {
		onSelect(
			(multiple
				? technologies.filter((v) => newlySelected.includes(v.id))
				: technologies.find((v) => v.id === newlySelected[0])) as TTechnology | TTechnology[],
			{
				reset
			}
		)
	}

	const onToggleSelected = (item: TTechnology) => () => {
		if (newlySelected.includes(item.id)) {
			newlySelected = newlySelected.filter((v) => v !== item.id)
		} else {
			newlySelected = [...newlySelected, item.id]
		}
	}

	let isInitialized = inline
	$: if (modal && !isInitialized) {
		isInitialized = true
	}

	let Component: typeof Div | typeof BaseModal = Div
	$: {
		Component = inline ? Div : BaseModal
	}
</script>

<svelte:component this={Component} bind:value={modal} hideClose modalBox="max-w-4xl">
	<svelte:fragment slot="activator">
		{#if !inline}
			<slot>
				<button type="button" class="btn btn-primary">Storage Picker</button>
			</slot>
		{/if}
	</svelte:fragment>
	{#if isInitialized}
		<div>
			<h3 class="text-lg font-medium">Tools/Technology Picker</h3>
			<div class="opacity-70">
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum vitae voluptas quasi
				expedita suscipit corrupti,.
			</div>
		</div>

		<input
			bind:value={search}
			type="text"
			placeholder="Search..."
			class="input w-full mt-4 bg-neutral input-primary"
			on:input={onInputSearch}
		/>

		<div class="grid grid-cols-5 gap-2 mt-3">
			{#each innerTechnologies as technology}
				{@const active = newlySelected.includes(technology.id)}
				<button
					on:click={onToggleSelected(technology)}
					class={cn('card px-4 py-4 flex flex-row items-center space-x-4', {
						'bg-primary text-white': active,
						'bg-neutral': !active
					})}
				>
					<div class="h-6 w-6">
						<Icon icon={technology.icon} class="text-2xl z-10" />
					</div>
					<div>
						{technology.name}
					</div>
				</button>
			{/each}
		</div>

		<div class="mt-4 flex items-center justify-end space-x-2">
			<button type="button" class="btn btn-ghost normal-case" on:click={reset}>Close</button>
			<button type="button" class="btn btn-primary normal-case px-8" on:click={onClickSelect}>
				Select
			</button>
		</div>
	{/if}
</svelte:component>

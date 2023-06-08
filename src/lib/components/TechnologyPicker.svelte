<script lang="ts">
	import type { TTechnology } from '$lib/types'

	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	import Div from './Div.svelte'
	import BaseModal from './base/BaseModal.svelte'

	import { useSelect } from '$lib/utils/useSelect'
	import { tick } from 'svelte'

	export let modal = false
	export let inline = true
	export let loading = false

	export let excluded: TTechnology[] = []
	export let technologies: TTechnology[]

	const restTechnologies = (excluded: TTechnology[]) => {
		return technologies.filter((v) => {
			return !excluded.some((s) => s.id === v.id)
		})
	}

	const {
		items,
		selected,
		setSelected,

		isSelected,

		inputValue,
		onInputValue,
		setInputValue,

		onClickItem: toggle
	} = useSelect({
		items: restTechnologies(excluded),
		multiple: true,
		returnObject: true,
		itemValue: 'id',
		itemText: 'name'
	})

	$: {
		items.set(restTechnologies(excluded))
	}

	const reset = () => {
		tick().then(() => {
			setInputValue('')
			setSelected([])
			items.set(restTechnologies(excluded))
		})
		modal = false
		loading = false
	}

	export let onSelect: (
		selected: TTechnology[],
		ctx: {
			reset: () => void
		}
	) => void = () => {
		//
	}

	const onClickSelect = () => {
		onSelect($selected, {
			reset
		})
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
			type="text"
			placeholder="Search..."
			class="input w-full mt-4 bg-neutral input-primary"
			value={$inputValue}
			on:input={onInputValue}
		/>

		<div class="grid grid-cols-5 gap-2 mt-3">
			{#each $items as technology}
				{@const active = isSelected(technology)}
				<button
					on:click={() => toggle(technology)}
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
			<button
				class:loading
				type="button"
				class="btn btn-primary normal-case px-8"
				on:click={onClickSelect}
			>
				Select
			</button>
		</div>
	{/if}
</svelte:component>

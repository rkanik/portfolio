<!-- svelte-ignore a11y-click-events-have-key-events -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import cn from 'classnames'
	import BaseTeleport from './BaseTeleport.svelte'
	import get from 'lodash/get'
	import Icon from '@iconify/svelte'

	export let required: boolean = false
	export let errors: string[] = []
	export let label: string = ''

	// Options
	type OptionsProps = any[] | ((q?: string) => Promise<any[]>)

	let optionHeight = 48
	let optionsMaxHeight = 384
	let filtered: any[] = []
	let innerOptions: any[] = []
	export let options: OptionsProps = []
	export let name: string = 'combobox'

	const fetchOptions = async () => {
		if (Array.isArray(options)) return options
		if (typeof options === 'function') {
			return await options()
		}
		return []
	}

	$: {
		filtered = inputValue
			? innerOptions.filter((option) => {
					return get(option, optionText, '').toLowerCase().includes(inputValue.toLowerCase())
			  })
			: innerOptions
	}

	onMount(async () => {
		innerOptions = await fetchOptions()
	})

	export let id = ''

	export let optionText = 'text'
	export let optionValue = 'value'
	export let value: any[] = []
	export let readonly = false
	export let placeholder = ''

	let input: any,
		inputValue: any,
		activeOption: any,
		showOptions = false,
		first = true,
		slot: any

	let el: HTMLDivElement
	let optionsEl: HTMLDivElement

	onMount(() => {
		first = false
	})

	$: if (el && optionsEl && showOptions) {
		const rect = el.getBoundingClientRect()
		const offsetTop = rect.top + rect.height

		let possibleHeight = filtered.length * optionHeight
		possibleHeight = possibleHeight <= optionsMaxHeight ? possibleHeight : optionsMaxHeight

		const canFitToBottom = window.innerHeight - (offsetTop + possibleHeight) > 0

		optionsEl.style.cssText += `
			z-index:9999;
			left:${rect.left}px;
			width:${rect.width}px;
		`
		optionsEl.style.cssText += canFitToBottom
			? `top:${offsetTop}px;`
			: `top:${rect.top - possibleHeight}px;`
	}

	$: if ((activeOption && !filtered.includes(activeOption)) || (!activeOption && inputValue)) {
		activeOption = filtered[0]
	}

	const isSame = (v1: any, v2: any) => {
		return get(v1, optionValue, v1) === get(v2, optionValue, v2)
	}

	const isSelected = (option: any) => {
		return value.some((item) => {
			return isSame(item, option)
		})
	}

	function add(option: any) {
		if (!readonly) {
			value = [...value, option]
		}
	}

	function remove(option: any) {
		if (!readonly) {
			value = value.filter((item) => {
				return !isSame(item, option)
			})
		}
	}

	function optionsVisibility(show: any) {
		if (readonly) return
		if (typeof show === 'boolean') {
			showOptions = show
			show && input.focus()
		} else {
			showOptions = !showOptions
		}
		if (!showOptions) {
			activeOption = undefined
		}
	}

	function handleKeyup(e: any) {
		if ([38, 40].includes(e.keyCode)) {
			const increment = e.keyCode === 38 ? -1 : 1
			const calcIndex = filtered.indexOf(activeOption) + increment
			activeOption =
				calcIndex < 0
					? filtered[filtered.length - 1]
					: calcIndex === filtered.length
					? filtered[0]
					: filtered[calcIndex]
		}
	}

	function handleBlur(e: any) {
		optionsVisibility(false)
	}

	function handleTokenClick(e: any) {
		if (e.target.closest('.remove-all')) {
			value = []
			inputValue = ''
		} else {
			optionsVisibility(true)
		}
	}

	const onToggle = (option: any) => {
		if (isSelected(option)) remove(option)
		else {
			add(option)
			input.focus()
		}
	}

	const dispatch = createEventDispatcher()
	$: {
		dispatch('change', value)
	}
</script>

<div class="form-control">
	{#if label}
		<label for={id} class="label">
			<span class="label-text">
				{label}
				{#if required}
					<span class="text-red-500">*</span>
				{/if}
			</span>
		</label>
	{/if}
	<div
		class="relative flex items-center h-auto py-2 input input-rounded input-bordered min-h-12"
		bind:this={el}
		class:readonly
	>
		<div class="flex flex-wrap flex-1 -mt-1 -ml-1" on:click|preventDefault={handleTokenClick}>
			{#each value || [] as option}
				<slot name="selection" {readonly} item={option} remove={() => remove(option)}>
					<button class="btn btn-sm mt-1 ml-1 space-x-1 rounded-full">
						<span class="normal-case">{get(option, optionText)}</span>
						{#if !readonly}
							<button
								type="button"
								on:click={(e) => {
									e.stopPropagation()
									remove(option)
								}}
							>
								<Icon icon="iconamoon:sign-times-circle-fill" />
							</button>
						{/if}
					</button>
				</slot>
			{/each}

			{#if !readonly}
				<input
					class="flex-1 mt-2 ml-2 bg-transparent focus:outline-none"
					{id}
					{placeholder}
					autocomplete="off"
					bind:this={input}
					bind:value={inputValue}
					on:blur|preventDefault={handleBlur}
					on:keyup|preventDefault={handleKeyup}
				/>
				<svg
					width="18"
					height="18"
					fill="currentColor"
					viewBox="0 0 18 18"
					xmlns="http://www.w3.org/2000/svg"
					class="absolute text-base transform -translate-y-1/2 pointer-events-none select-none right-3 top-1/2"
				>
					<path d="M5 8l4 4 4-4z" />
				</svg>
			{/if}
		</div>

		<select bind:this={slot} multiple class="hidden">
			<slot />
		</select>

		<BaseTeleport to="body">
			<div bind:this={optionsEl} class="fixed">
				{#if showOptions}
					<ul
						class="overflow-y-auto menu bg-base-100 p-2 max-h-96 flex-nowrap border border-white border-opacity-10 space-y-1 mt-1 rounded-xl"
						on:mousedown|preventDefault
						transition:fly={{ duration: 200, y: 5 }}
					>
						{#each filtered as option}
							<slot
								name="item"
								item={option}
								selected={isSelected(option)}
								focused={activeOption === option}
								onClick={() => onToggle(option)}
							>
								<li on:click={() => onToggle(option)}>
									{get(option, optionText)}
								</li>
							</slot>
						{/each}
					</ul>
				{/if}
			</div>
		</BaseTeleport>
	</div>
	{#if errors.length > 0}
		<label for={id} class="label">
			<span class="label-text-alt text-error">
				{errors.toString()}
			</span>
		</label>
	{/if}
</div>

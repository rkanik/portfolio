<!-- svelte-ignore a11y-click-events-have-key-events -->
<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import BaseTeleport from './BaseTeleport.svelte'
	import get from 'lodash/get'
	import { cn } from '$lib/utils/cn'

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

	const iconClearPath =
		'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'

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
		if ([13, 45].includes(e.keyCode)) {
			if (!activeOption) {
				;(e.target.value || '')
					.trim()
					.split(' ')
					.forEach((value: string) => {
						if (!isSelected(value)) {
							add({
								[optionText]: value,
								[optionValue]: value
							})
						}
					})
			} else {
				isSelected(activeOption) ? remove(activeOption) : add(activeOption)
			}
			inputValue = ''
		}

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
		if (e.target.closest('.token-remove')) {
			e.stopPropagation()
			remove(e.target.closest('.token').dataset.id)
		} else if (e.target.closest('.remove-all')) {
			value = []
			inputValue = ''
		} else {
			optionsVisibility(true)
		}
	}

	function handleOptionMousedown(e: any) {
		const value = e.target.dataset.value
		if (isSelected(value)) remove(value)
		else {
			add(
				innerOptions.find((option) => {
					return get(option, optionValue) === value
				})
			)
			input.focus()
		}
	}
</script>

<div
	class="relative flex items-center h-auto py-2 input input-rounded input-bordered min-h-12"
	bind:this={el}
	class:readonly
>
	<div class="flex flex-wrap flex-1 -mt-2 -ml-2" on:click|preventDefault={handleTokenClick}>
		{#each value || [] as option}
			<div
				class="flex items-center h-8 gap-2 pl-3 pr-2 mt-2 ml-2 space-x-2 rounded-full bg-base-300"
				data-id={get(option, optionValue)}
			>
				<span class="leading-none">{get(option, optionText)}</span>
				{#if !readonly}
					<button type="button" on:click={() => remove(option)}>
						<svg
							class="text-base"
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d={iconClearPath} />
						</svg>
					</button>
				{/if}
			</div>
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
				<div class="overflow-hidden bg-gray-600 rounded-lg {filtered.length ? 'p-2' : ''}">
					<ul
						class="overflow-y-auto menu max-h-96 flex-nowrap"
						transition:fly|global={{ duration: 200, y: 5 }}
						on:mousedown|preventDefault={handleOptionMousedown}
					>
						{#each filtered as option}
							<li>
								<span
									data-value={get(option, optionValue)}
									on:click={(e) => e.preventDefault()}
									class={cn('rounded-lg', {
										'bg-black bg-opacity-20': activeOption === option,
										'bg-purple-500 bg-opacity-20 text-white': isSelected(option)
									})}
								>
									{get(option, optionText)}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</BaseTeleport>
</div>

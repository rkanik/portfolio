<script lang="ts">
	import type { TMenuItem } from './types'

	import Menu from './Menu.svelte'
	import Icon from '@iconify/svelte'
	import cn from '$lib/utils/cn'
	import { page } from '$app/stores'

	export let item: TMenuItem
</script>

<li>
	{#if item.title}
		<h2 class="menu-title flex items-center gap-4 px-1.5">
			{#if item.icon}
				<svelte:component this={item.icon} />
			{/if}
			{item.title}
		</h2>
		<Menu menu={false} items={item.children || []} />
	{:else if item.children}
		<details open>
			<summary class="group">
				{#if item.icon}
					<svelte:component this={item.icon} />
				{/if}
				{item.text}
			</summary>
			<Menu menu={false} items={item.children} />
		</details>
	{:else if item.href}
		<a
			href={item.href}
			class={cn({
				active: item.href === $page.url.pathname
			})}
		>
			{#if item.icon}
				<svelte:component this={item.icon} />
			{/if}
			{item.text}
		</a>
	{:else}
		<span>{item.text}</span>
	{/if}
</li>

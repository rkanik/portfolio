<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'

	const items = [
		{
			href: '/projects',
			label: 'Projects'
		},
		{
			href: '/testimonials',
			label: 'Testimonials'
		},
		{
			href: '/experiences',
			label: 'Experiences'
		},
		{
			href: '/about',
			label: 'About'
		}
	]

	let top = '0px'
	let oldScrollY = 0
	let background = 'bg-transparent'

	const calculateProperties = () => {
		top = oldScrollY >= window.scrollY ? '0px' : '-128px'
		background = window.scrollY > 64 ? 'bg-base-200' : 'bg-transparent'
	}

	onMount(() => {
		calculateProperties()
		oldScrollY = window.scrollY
		window.onscroll = () => {
			calculateProperties()
			oldScrollY = window.scrollY
		}
	})
</script>

<div
	style="top:{top};"
	class="fixed inset-x-0 top-0 z-50 navbar transition-all duration-500 {background}"
>
	<div class="container mx-auto bg-transparent">
		<div class="dropdown">
			<button tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					fill="none"
					class="w-5 h-5"
					viewBox="0 0 24 24"
					stroke="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</button>
			<ul
				class="p-2 mt-3 menu menu-compact dropdown-content rounded-box w-52 bg-base-100 shadow-2xl"
			>
				{#each items as item}
					<li>
						<a href={item.href}>{item.label}</a>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<a href="/" class="font-bold text-2xl inline">
				<span>R</span><span class="text-secondary">.</span><span>K</span><span
					class="text-secondary">.</span
				>
			</a>
		</div>

		<div class="hidden lg:flex ml-auto">
			<ul class="px-1 flex items-center space-x-6">
				{#each items as item}
					<li>
						<a
							href={item.href}
							class="tracking-wide relative py-2 {$page.url.pathname === item.href
								? 'font-medium'
								: 'font-normal'}"
						>
							<span>{item.label}</span>
							<span
								class="h-0.5 rounded-full bg-secondary block transition-all absolute left-0 bottom-0 duration-500 {$page
									.url.pathname === item.href
									? 'w-3/4'
									: 'w-0'}"
							/>
						</a>
					</li>
				{/each}
			</ul>
		</div>
		<div class="ml-8">
			<a href="/contact" class="btn btn-outline btn-secondary rounded-full normal-case"
				>Contact Me</a
			>
		</div>
	</div>
</div>

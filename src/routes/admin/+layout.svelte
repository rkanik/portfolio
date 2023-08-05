<script lang="ts">
	import '../../app.css'

	import LoginForm from '$lib/components/LoginForm.svelte'
	import ThemeChange from '$lib/components/ThemeChange.svelte'
	import { page } from '$app/stores'
	import Icon from '@iconify/svelte'

	export let data

	// Logout
	let isLoggingOut = false
	const onLogout = async () => {
		isLoggingOut = true
		await data.supabase.auth.signOut()
		isLoggingOut = false

		window.location.reload()
	}

	const items = [
		{ path: '/admin', name: 'Dashboard' },
		{ path: '/admin/projects', name: 'Projects' },
		{ path: '/admin/testimonials', name: 'Testimonials' },
		{ path: '/admin/uploads', name: 'Uploads' },
		{ path: '/admin/storage', name: 'Storage' },
		{ title: 'Category' },
		{ path: '/admin/sortable', name: 'Sortable' },
		{ path: '/admin/menu', name: 'Menu' }
	]
</script>

<svelte:head>
	{#if !data.session}
		<title>Login | Rasel Khandkar</title>
	{/if}
</svelte:head>

{#if data.session}
	<div class="drawer drawer-mobile bg-base-300">
		<input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<div class="navbar bg-base-300 border-b border-base-100 sticky top-0 z-20 h-12 min-h-12">
				<div class="flex-1">
					<label for="dashboard-drawer" class="drawer-button lg:hidden">
						<Icon icon="mdi-menu" />
					</label>
				</div>
				<div class="flex-none">
					<ThemeChange />
					<button class="btn btn-ghost btn-circle">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/></svg
						>
					</button>
					<button class="btn btn-ghost btn-circle">
						<div class="indicator">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/></svg
							>
							<span class="badge badge-xs badge-primary indicator-item" />
						</div>
					</button>

					<div class="dropdown dropdown-end">
						<button tabindex="0" class="btn btn-ghost btn-circle avatar">
							<div class="w-10 rounded-full">
								<img
									alt="User avatar"
									src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
								/>
							</div>
						</button>
						<ul
							tabindex="-1"
							class="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
						>
							<li>
								<a href="#" class="justify-between">
									Profile
									<span class="badge">New</span>
								</a>
							</li>
							<li><a href="#">Settings</a></li>
							<li>
								<a href="#" on:click={onLogout}>{isLoggingOut ? 'Logging Out...' : 'Logout'}</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<slot />
		</div>
		<div class="drawer-side border-r border-base-100">
			<label for="dashboard-drawer" class="drawer-overlay !bg-black !bg-opacity-50" />
			<div class="w-60 bg-base-200 lg:bg-base-300">
				<div class="h-12 flex items-center px-4 border-b border-base-100">
					<a href="/" class="inline text-2xl font-bold">
						<span>R</span><span class="text-primary">.</span><span>K</span><span
							class="text-primary">.</span
						>
					</a>
				</div>
				<ul class="menu menu-compact rounded-box p-2 space-y-1">
					{#each items as item}
						{#if 'title' in item}
							<li class="menu-title">
								<span>{item.title}</span>
							</li>
						{:else}
							<li
								class={$page.url.pathname === item.path
									? 'bg-primary bg-opacity-20 font-bold text-primary rounded-lg'
									: ''}
							>
								<a href={item.path}>{item.name}</a>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center h-screen">
		<LoginForm />
	</div>
{/if}

<script lang="ts">
	import '../../app.css'

	import LoginForm from '$lib/components/LoginForm.svelte'
	import ThemeChange from '$lib/components/ThemeChange.svelte'
	import { page } from '$app/stores'

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
		{ path: '/admin/storage', name: 'Storage' }
	]
</script>

<svelte:head>
	{#if !data.session}
		<title>Login | Rasel Khandkar</title>
	{/if}
</svelte:head>

{#if data.session}
	<div class="drawer drawer-mobile">
		<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
		<div class="flex flex-col drawer-content">
			<div class="navbar bg-base-100">
				<!-- <div class="flex-none lg:hidden">
					<label for="my-drawer-3" class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-6 h-6 stroke-current"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/></svg
						>
					</label>
				</div> -->
				<div class="flex-none">
					<button class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-5 h-5 stroke-current"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/></svg
						>
					</button>
				</div>
				<div class="flex-1">
					<a href="/admin" class="text-xl normal-case btn btn-ghost">Admin</a>
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
		<div class="drawer-side bg-base-100">
			<label for="my-drawer-2" class="drawer-overlay" />
			<div>
				<div class="h-16" />
				<ul class="menu w-80 text-base-content">
					{#each items as item}
						<li
							class={$page.url.pathname === item.path
								? 'bordered bg-primary bg-opacity-20 font-medium'
								: 'hover-bordered'}
						>
							<a href={item.path}>{item.name}</a>
						</li>
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

<script lang="ts">
	import '../../app.css'

	import LoginForm from '$lib/components/LoginForm.svelte'
	import ThemeChange from '$lib/components/ThemeChange.svelte'
	import { Menu, type TMenuItem } from '$lib/components/ui/menu'

	import IconMdiAccount from '~icons/mdi/account'
	import IconMdiViewDashboard from '~icons/mdi/view-dashboard'
	import IconMdiTable from '~icons/mdi/table'
	import IconMdiMessage from '~icons/mdi/message'
	import IconMdiUpload from '~icons/mdi/upload'
	import IconMdiDatabase from '~icons/mdi/database'
	import IconMdiSort from '~icons/mdi/sort'
	import EosIconsAdmin from '~icons/eos-icons/admin'
	import { PaneGroup, Pane, PaneResizer } from 'paneforge'
	import { setContext } from 'svelte'
	import { usePaneGroup } from '$lib/utils/usePaneGroup'

	export let data
	setContext('cookies', data.cookies)

	// Logout
	let isLoggingOut = false
	const onLogout = async () => {
		isLoggingOut = true
		await data.supabase.auth.signOut()
		isLoggingOut = false

		window.location.reload()
	}

	const items: TMenuItem[] = [
		{
			text: 'Admin',
			icon: EosIconsAdmin,
			children: [
				{ href: '/admin', exact: true, text: 'Dashboard', icon: IconMdiViewDashboard },
				{ href: '/admin/projects', text: 'Projects', icon: IconMdiTable },
				{ href: '/admin/testimonials', text: 'Testimonials', icon: IconMdiMessage },
				{ href: '/admin/uploads', text: 'Uploads', icon: IconMdiUpload },
				{ href: '/admin/storage', text: 'Storage', icon: IconMdiDatabase },
				{ href: '/admin/sortable', text: 'Sortable', icon: IconMdiSort }
			]
		},
		{
			icon: IconMdiAccount,
			text: 'Menu',
			children: [
				{ text: 'Sub Item 1' },
				{ text: 'Sub Item 2' },
				{ text: 'Sub Item 3' },
				{ text: 'Sub Item 4' },
				{
					title: 'Sub Item 5',
					icon: IconMdiAccount,
					children: [
						{ text: 'Sub Sub Item 1' },
						{ text: 'Sub Sub Item 2', children: [{ text: 'Sub Sub Sub Item 1' }] },
						{ text: 'Sub Sub Item 3' }
					]
				}
			]
		}
	]

	const { layout, onLayoutChange } = usePaneGroup('admin-layout-pane', [15, 85])
</script>

<svelte:head>
	{#if !data.session}
		<title>Login | Rasel Khandkar</title>
	{/if}
</svelte:head>

{#if data.session}
	<div class="flex h-screen overflow-hidden bg-base-300 flex-col">
		<div class="navbar bg-base-300 flex-none border-b border-base-100 z-10">
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
			<!-- <div class="flex-none">
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
				</div> -->
			<div class="flex-1 px-4">
				<!-- <a href="/admin" class="text-xl normal-case btn btn-ghost">Admin</a> -->
				<a href="/admin" class="inline text-2xl font-bold">
					<span>R</span><span class="text-secondary">.</span><span>K</span><span
						class="text-secondary">.</span
					>
				</a>
			</div>
			<div class="flex-none">
				<ThemeChange />
				<!-- <button class="btn btn-ghost btn-circle">
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
				</button> -->

				<div class="dropdown dropdown-end">
					<!-- <button tabindex="0" class="btn btn-ghost btn-circle avatar"> -->
					<!-- <div class="w-10 rounded-full">
							<img
								alt="User avatar"
								src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
							/>
						</div> -->
					<button class="avatar placeholder">
						<div class="bg-neutral text-neutral-content w-10 rounded-full">
							<span class="text-sm uppercase">{data.session?.user?.email?.slice(0, 2)}</span>
						</div>
					</button>
					<!-- </button> -->
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
		<PaneGroup direction="horizontal" {onLayoutChange}>
			<Pane minSize={10} maxSize={25} defaultSize={layout?.[0]} class="flex-col flex">
				<div class="bg-base-300 flex-1 overflow-auto">
					<Menu {items} />
				</div>
			</Pane>
			<PaneResizer class="w-2 relative h-full flex flex-col items-center">
				<div class="w-px bg-base-100 flex-1" />
			</PaneResizer>
			<Pane defaultSize={layout?.[1]} class="flex flex-col">
				<div class="flex-1 overflow-auto">
					<slot />
				</div>
			</Pane>
		</PaneGroup>
	</div>
{:else}
	<div class="flex items-center justify-center h-screen">
		<LoginForm />
	</div>
{/if}

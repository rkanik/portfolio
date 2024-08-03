<script lang="ts">
	import MdiLocalAreaNetwork from '~icons/mdi/local-area-network'
	import MdiMessageQuestionOutline from '~icons/mdi/message-question-outline'
	import MdiMessageReplyTextOutline from '~icons/mdi/message-reply-text-outline'
	import MdiSettings from '~icons/mdi/settings'
	import MdiViewGridOutline from '~icons/mdi/view-grid-outline'
	import MdiWebOntologyLanguage from '~icons/mdi/web-ontology-language'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import AdminMenubar from '$lib/components/admin/AdminMenubar.svelte'
	import AdminUserDropdownMenu from '$lib/components/admin/AdminUserDropdownMenu.svelte'
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte'
	import { ModeWatcher } from 'mode-watcher'
	import * as AlertDialog from '@ui/alert-dialog'
	import Button from '@ui/button/button.svelte'
	import * as Card from '@ui/card'
	import Input from '@ui/input/input.svelte'
	import Label from '@ui/label/label.svelte'

	export let data
	const { session, supabase } = data

	const items = [
		{
			href: '/admin',
			label: 'Dashboard',
			icon: MdiViewGridOutline,
		},
		{
			href: '/admin/projects',
			label: 'Projects',
			icon: MdiLocalAreaNetwork,
		},
		{
			href: '/admin/testimonials',
			label: 'Testimonials',
			icon: MdiMessageReplyTextOutline,
		},
		{
			href: '/admin/inquiries',
			label: 'Inquiries',
			icon: MdiMessageQuestionOutline,
		},
		{
			href: '/admin/technologies',
			label: 'Technologies',
			icon: MdiWebOntologyLanguage,
		},
	]

	let loading = false
	let loginForm: HTMLFormElement

	const form = {
		email: '',
		password: '',
	}

	const onClickSignIn = async () => {
		loading = true
		await supabase.auth.signInWithPassword({
			email: form.email,
			password: form.password,
		})
		loading = false
		window.location.reload()
	}
</script>

<svelte:head>
	<title>Admin Panel</title>
</svelte:head>

<AlertDialog.Root open={!session}>
	<AlertDialog.Content class="max-w-sm border-none p-0">
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Create an account</Card.Title>
				<Card.Description
					>Enter your email below to create your account</Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid grid-cols-2 gap-6">
					<Button variant="outline">
						<!-- <Icons.gitHub class="mr-2 h-4 w-4" /> -->
						GitHub
					</Button>
					<Button variant="outline">
						<!-- <Icons.google class="mr-2 h-4 w-4" /> -->
						Google
					</Button>
				</div>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-card px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="Enter email address..."
						bind:value={form.email}
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						bind:value={form.password}
					/>
				</div>
			</Card.Content>
			<Card.Footer>
				<Button class="w-full" disabled={loading} on:click={onClickSignIn}>
					Create account
				</Button>
			</Card.Footer>
		</Card.Root>
	</AlertDialog.Content>
</AlertDialog.Root>

<ModeWatcher />
<div class="flex h-screen flex-col overflow-hidden bg-background">
	<AdminMenubar class="flex-none" />
	<div class="flex flex-1">
		<div class="flex flex-none flex-col space-y-3 border-r px-2 py-3">
			<div class="mt-auto"></div>
			<ThemeSwitcher />
			<Button
				size="icon"
				variant="secondary"
				class="relative rounded-full p-0"
			>
				<MdiSettings />
			</Button>
			<AdminUserDropdownMenu />
		</div>
		<div class="flex w-64 flex-none flex-col justify-between">
			<div class="flex h-16 items-center px-3">
				<h2 class="text-lg font-semibold tracking-tight">Discover</h2>
			</div>
			<div class="flex-1 overflow-y-scroll">
				<div class="space-y-1 px-3">
					{#each items as item}
						<Button
							href={item.href}
							class="w-full justify-start space-x-4"
							variant={item.href === $page.url.pathname
								? 'secondary'
								: 'ghost'}
						>
							<svelte:component this={item.icon} class="text-base" />
							<span>{item.label}</span>
						</Button>
					{/each}
				</div>
			</div>
			<div class="py-4"></div>
		</div>
		<div class="flex-1 overflow-y-scroll border-l">
			<slot />
		</div>
	</div>
	<div class="h-6 flex-none border-t"></div>
</div>

<script lang="ts">
	import '../../app.css'

	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { invalidate } from '$app/navigation'

	import Navbar from '$lib/components/Navbar.svelte'
	import ScrollToTop from '$lib/components/ScrollToTop.svelte'
	import SocialLinks from '$lib/components/SocialLinks.svelte'
	import Icon from '@iconify/svelte'

	export let data
	$: ({ supabase, session } = data)
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:head />

<div>
	<Navbar />
	<ScrollToTop />

	<div class={$page.url.pathname !== '/' ? 'pt-20' : ''}>
		<slot />
	</div>

	<footer class="p-4 lg:p-16 footer footer-center">
		<a href="/" class="inline text-2xl font-bold">
			<span>R</span><span class="text-secondary">.</span><span>K</span><span class="text-secondary"
				>.</span
			>
		</a>

		<div class="text-lg font-medium">
			Living, learning, & leveling up <br /> one day at a time.
		</div>

		<SocialLinks
			btnClass="btn-circle btn-outline border-solid border-white border-opacity-20"
			iconClass="text-2xl"
		/>

		<div class="block">
			<span>© 2023 Rasel Khandkar | All rights reserved</span> <br />
			<div class="flex items-center justify-center mt-2 space-x-2">
				<span>Made with</span>
				<a href="https://kit.svelte.dev/">
					<Icon icon="logos:svelte-kit" class="text-xl" />
				</a>
			</div>
		</div>
	</footer>
</div>

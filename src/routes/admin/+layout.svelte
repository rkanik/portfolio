<script lang="ts">
	import MdiViewGridOutline from '~icons/mdi/view-grid-outline'
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte'
	import { ModeWatcher } from 'mode-watcher'
	import Button from '@ui/button/button.svelte'

	//
</script>

<ModeWatcher />
<div class="flex h-screen overflow-hidden bg-background">
	<div class="w-64 flex-none flex flex-col justify-between">
		<div class="h-16 flex items-center px-4">
			<h2 class="text-lg font-semibold tracking-tight">Discover</h2>
		</div>
		<div class="flex-1">
			<div class="px-4">
				<Button variant="secondary" class="w-full justify-start">
					<MdiViewGridOutline />
					Listen Now
				</Button>
			</div>
		</div>
		<div class="py-4">
			<div class="px-4 flex items-center justify-between">
				<div>Theme</div>
				<ThemeSwitcher />
			</div>
		</div>
	</div>
	<div class="flex-1 overflow-auto border-l">
		<slot />
	</div>
</div>

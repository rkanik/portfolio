<script lang="ts">
	import { page } from '$app/stores'
	import Icon from '@iconify/svelte'
</script>

<div class="container mx-auto py-20 min-h-screen">
	<img src="/img/404.svg" alt="404" class="mx-auto max-w-3xl w-full" />
	<h1 class="text-4xl mt-8 text-center font-bold">{$page.error?.message}</h1>
	<div class="flex justify-center mt-4 space-x-4">
		<button
			class="btn btn-outline btn-secondary rounded-full pr-6"
			on:click={() => {
				window.history.back()
			}}
		>
			<span class="w-5">
				<Icon class="text-xl" icon="mdi:chevron-left" />
			</span>
			<span>Go back</span>
		</button>
		<a href="/" class="btn btn-secondary rounded-full px-8">
			<span class="w-5">
				<Icon class="text-xl" icon="mdi:home-outline" />
			</span>
			<span>Home</span>
		</a>
	</div>
</div>

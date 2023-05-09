<script>
	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'

	const sites = [
		{
			icon: 'mdi:github',
			href: 'https://github.com/rkanik'
		},
		{
			icon: 'mdi:linkedin',
			href: 'https://www.linkedin.com/in/rkanik'
		},
		{
			icon: 'mdi:facebook',
			href: 'https://www.facebook.com/rkanik.me'
		},
		{
			icon: 'mdi:instagram',
			href: 'https://www.instagram.com/rkanik.me'
		},
		{
			icon: 'mdi:whatsapp',
			href: 'https://wa.me/+8801703577953'
		},
		{
			icon: 'mdi:gmail',
			href: 'mailto:rkanik.me@gmail.com'
		}
	]

	export let iconClass = 'text-lg md:text-4xl'
	export let btnClass = 'btn-square btn-outline btn-sm md:btn-md'
</script>

<div class={cn('flex space-x-2', $$props.class)}>
	{#each sites as site}
		<a target="_blank" rel="noreferrer" class={cn('btn', btnClass)} href={site.href}>
			<Icon icon={site.icon} class={iconClass} />
		</a>
	{/each}
</div>

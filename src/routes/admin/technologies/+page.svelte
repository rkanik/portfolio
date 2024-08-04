<script lang="ts">
	import Icon from '@iconify/svelte'
	import { page } from '$app/stores'
	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import TechnologyPicker from '$lib/components/TechnologyPicker.svelte'
	import { trpc } from '$lib/trpc/client'
	import { writable } from 'svelte/store'

	export let data

	const { api } = data

	const technologies = data.technologies()
</script>

<div class="p-8">
	<div class="flex justify-between">
		<div></div>
		<!-- <TechnologyFormDialog /> -->
	</div>
	<div class="mt-4 grid gap-4 2xl:grid-cols-8">
		{#each $technologies.data || [] as item}
			<!-- {@const isDeleting = deleteLoadingId === item.id}
		{@const isVisibilityUpdating = isVisibleLoadingId === item.id} -->
			<div
				class="item group card relative h-32 cursor-grab bg-neutral text-neutral-content"
			>
				<!-- <div
				data-tip="Delete"
				class="tooltip tooltip-left tooltip-primary absolute right-1 top-1 z-10"
			>
				<button
					class={cn('btn-outline btn-error btn-xs btn-circle btn', {
						'invisible opacity-0 group-hover:visible group-hover:opacity-100':
							!isDeleting,
					})}
					class:loading={isDeleting}
					on:click={onClickDelete(item)}
				>
					{#if !isDeleting}
						<Icon icon="mdi-delete-outline" />
					{/if}
				</button>
			</div> -->

				<div
					data-tip="Toggle visibility"
					class="tooltip tooltip-left tooltip-primary absolute bottom-1 right-1 z-10"
				>
					<!-- <button
					class={cn('btn-outline btn-xs btn-circle btn', {
						'btn-warning invisible opacity-0 group-hover:visible group-hover:opacity-100':
							item.isVisible && !isVisibilityUpdating,
						'btn-ghost opacity-50 group-hover:opacity-100':
							!item.isVisible && !isVisibilityUpdating,
						'btn-success': isVisibilityUpdating,
					})}
					class:loading={isVisibilityUpdating}
					on:click={onToggleIsVisible(item)}
				>
					{#if !isVisibilityUpdating}
						{#if item.isVisible}
							<Icon icon="mdi-eye-outline" />
						{:else}
							<Icon icon="mdi-eye-off-outline" />
						{/if}
					{/if}
				</button> -->
				</div>

				<div class="card-body relative justify-end">
					<Icon
						icon={item.icon}
						class="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform text-8xl opacity-[0.02]"
					/>
					<div class="h-6 w-6">
						<Icon icon={item.icon} class="z-10 text-3xl" />
					</div>
					<div class="z-10 mt-2 text-base font-bold">{item.name}</div>
				</div>
			</div>
		{/each}
	</div>
	<!-- <TechnologyPicker technologies={$technologies.data} inline={true} />
	<BaseJson
		data={{
			isFetching: $technologies.isFetching,
			data: $technologies.data,
		}}
	/> -->
</div>

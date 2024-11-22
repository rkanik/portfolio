<script lang="ts">
	import type { TTechnology } from '$lib/types'
	import Icon from '@iconify/svelte'
	import TechnologyFormDialog from '@modules/technologies/TechnologyFormDialog.svelte'
	import MdiDeleteOutline from '~icons/mdi/delete-outline'
	import MdiSquareEditOutline from '~icons/mdi/square-edit-outline'
	import { Button } from '@/lib/components/ui/button'
	import { Card, CardContent } from '@/lib/components/ui/card'

	export let data

	const { api } = data
	const technologies = data.technologies()

	//
	const remover = api.technologies.remove.createMutation()
	const onClickDelete = (id: string) => {
		if (!confirm('Are you sure you want to delete this technology?')) return
		$remover.mutate(id, {
			onSuccess() {
				$technologies.refetch()
			},
		})
	}

	//
	let open = false
	let technology: TTechnology | undefined

	const onClickUpdate = (item: TTechnology) => {
		open = true
		technology = item
	}
</script>

<div class="p-8">
	<div class="flex justify-between">
		<div></div>
		<div>
			<TechnologyFormDialog
				{open}
				initialForm={data.form}
				initialData={technology}
				onOpenChange={(v) => {
					open = v
					if (!v) technology = undefined
				}}
				on:success={() => $technologies.refetch()}
			/>
		</div>
	</div>
	{#if $technologies.isFetching}
		<div>Loading...</div>
	{/if}
	<div class="mt-4 grid gap-4 2xl:grid-cols-8">
		{#each $technologies.data || [] as item}
			<Card class="group relative overflow-hidden">
				<CardContent class="space-y-2 pt-6">
					<div class="h-8 w-8">
						<Icon
							icon={item.icon}
							color={item.color}
							class="z-10 text-3xl"
						/>
					</div>
					<div class="z-10 mt-2 text-base font-bold">{item.name}</div>
				</CardContent>
				<Icon
					icon={item.icon}
					color={item.color}
					class="absolute -bottom-4 -right-4 z-0 transform text-8xl opacity-[0.02]"
				/>
				<div
					class="invisible absolute bottom-0 right-0 flex items-center -space-x-1 p-0.5 opacity-0 transition-all group-hover:visible group-hover:opacity-100"
				>
					<Button
						size="icon"
						variant="ghost"
						class=" flex h-7 w-7 rounded-md text-neutral-400 dark:text-neutral-500"
						on:click={() => onClickUpdate(item)}
					>
						<MdiSquareEditOutline />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						class="flex h-7 w-7 rounded-md text-neutral-400 hover:!text-red-500 dark:text-neutral-500"
						on:click={() => onClickDelete(item.id)}
					>
						<MdiDeleteOutline />
					</Button>
				</div>
			</Card>
		{/each}
	</div>
</div>

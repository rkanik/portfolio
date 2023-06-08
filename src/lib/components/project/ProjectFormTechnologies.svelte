<script lang="ts">
	import type { Nullable, TId, TProject, TProjectTechnology } from '$lib/types'

	import { useDebounceFn } from 'sveltuse'
	import { useGlobalPageData } from '$lib/utils/useGlobalPageData'
	import { getAverageSortOrder } from '$lib/utils/getAverageSortOrder'

	import cn from '$lib/utils/cn'
	import Icon from '@iconify/svelte'
	import SvelteSortable from 'sveltuse/dist/components/SvelteSortable.svelte'
	import TechnologyPicker from '../TechnologyPicker.svelte'

	export let project: TProject
	export let technologies: TTechnology[]

	const { supabase } = useGlobalPageData()

	const update = (id: TId, item: Partial<TProjectTechnology>) => {
		project = {
			...project,
			projectTechnologies: project.projectTechnologies.map((v) => {
				return v.id === id ? { ...v, ...item } : v
			})
		}
	}

	const remove = (id: TId) => {
		project = {
			...project,
			projectTechnologies: project.projectTechnologies.filter((v) => {
				return v.id !== id
			})
		}
	}

	const supabaseUpdate = async (id: TId, item: Partial<TProjectTechnology>) => {
		const { error } = await supabase
			.from('projectTechnologies')
			.update(item)
			.eq('id', id)
			.select('*,technologies(*)')
			.single()

		if (error) {
			console.log('update', id, item, error)
			return
		}

		update(id, item)
	}

	const onChangeProjectTechnologySortOrder = useDebounceFn(async (newIndex: number) => {
		const { item } = getAverageSortOrder(project.projectTechnologies, newIndex)
		supabaseUpdate(item.id, { sortOrder: item.sortOrder })
	}, 1000)

	let isVisibleLoadingId: Nullable<TId> = null
	const onToggleIsVisible = (item: TProjectTechnology) => async () => {
		isVisibleLoadingId = item.id
		await supabaseUpdate(item.id, { isVisible: !item.isVisible })
		isVisibleLoadingId = null
	}

	let deleteLoadingId: Nullable<TId> = null
	const onClickDelete = (item: TProjectTechnology) => async () => {
		if (confirm('Are you sure to remove this technology?')) {
			deleteLoadingId = item.id
			await supabase.from('projectTechnologies').delete().eq('id', item.id)
			deleteLoadingId = null
			remove(item.id)
		}
	}

	// Picker
	let modal = true
	let selectedTechnologies: TId[] = []

	$: {
		selectedTechnologies = project.projectTechnologies.map((v) => {
			return v.technologies.id
		})
	}

	const onSelect = (v: any, ctx: any) => {
		console.log('onSelect', v)

		ctx.reset()
	}
</script>

<div class={$$props.class}>
	<h2 class="font-medium text-lg">Project Tools & Technologies</h2>
	<div class="opacity-70">
		Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam eius quae, voluptatem quis
		consequuntur officia et voluptatibus tenetur? Magni sequi molestiae id aut nihil fuga unde. Quae
		fugit doloribus temporibus!
	</div>

	<SvelteSortable
		bind:items={project.projectTechnologies}
		options={{ animation: 150, draggable: '.item' }}
		onUpdated={onChangeProjectTechnologySortOrder}
		class="grid 2xl:grid-cols-5 gap-4 mt-4"
	>
		{#each project.projectTechnologies as item}
			{@const isDeleting = deleteLoadingId === item.id}
			{@const isVisibilityUpdating = isVisibleLoadingId === item.id}
			<div class="item card bg-neutral text-neutral-content h-32 relative group cursor-grab">
				<div
					data-tip="Delete"
					class="tooltip tooltip-left tooltip-primary absolute z-10 right-1 top-1"
				>
					<button
						class={cn('btn btn-circle btn-xs btn-outline btn-error', {
							'opacity-0 invisible group-hover:opacity-100 group-hover:visible': !isDeleting
						})}
						class:loading={isDeleting}
						on:click={onClickDelete(item)}
					>
						{#if !isDeleting}
							<Icon icon="mdi-delete-outline" />
						{/if}
					</button>
				</div>

				<div
					data-tip="Toggle visibility"
					class="tooltip tooltip-left tooltip-primary absolute z-10 right-1 bottom-1"
				>
					<button
						class={cn('btn btn-circle btn-xs btn-outline', {
							'btn-warning opacity-0 invisible group-hover:opacity-100 group-hover:visible':
								item.isVisible && !isVisibilityUpdating,
							'btn-ghost opacity-50 group-hover:opacity-100':
								!item.isVisible && !isVisibilityUpdating,
							'btn-success': isVisibilityUpdating
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
					</button>
				</div>

				<div class="card-body relative justify-end">
					<Icon
						icon={item.technologies.icon}
						class="absolute text-8xl opacity-[0.02] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
					/>
					<div class="h-6 w-6">
						<Icon icon={item.technologies.icon} class="text-2xl z-10" />
					</div>
					<div class="text-base font-bold z-10">{item.technologies.name}</div>
				</div>
			</div>
		{/each}

		<TechnologyPicker
			{technologies}
			inline={false}
			multiple={true}
			bind:modal
			bind:selected={selectedTechnologies}
			{onSelect}
		>
			<svelte:fragment>
				<button
					type="button"
					class="card bg-neutral h-32 grid place-items-center"
					on:click={() => (modal = true)}
				>
					<div class="tooltip tooltip-top tooltip-primary" data-tip="Add new technology">
						<Icon class="text-8xl text-white text-opacity-5" icon="mdi-plus" />
					</div>
				</button>
			</svelte:fragment>
		</TechnologyPicker>
	</SvelteSortable>
</div>

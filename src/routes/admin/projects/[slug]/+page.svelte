<script lang="ts">
	import type { Maybe, TProjectAttachment } from '$lib/types'
	import type { OnSelectHandlerMultiple } from '$lib/components/StorageManager2.svelte'

	import { onMount } from 'svelte'
	import { createForm } from 'felte'
	import { page } from '$app/stores'
	import { validator } from '@felte/validator-zod'
	import { useProjects } from '$lib/modules/Projects'
	import { getPublicUrl } from '$lib/utils/getPublicUrl'
	import { getNewSortOrder } from '$lib/utils/getNewSortOrder'
	import { getAverageSortOrder } from '$lib/utils/getAverageSortOrder'

	import z from 'zod'
	import cn from '$lib/utils/cn'

	import Icon from '@iconify/svelte'
	import Github from '$lib/utils/Github'
	import TextField from '$lib/components/base/TextField.svelte'
	import BaseImage from '$lib/components/base/BaseImage.svelte'
	import StoragePicker from '$lib/components/StoragePicker.svelte'
	import Autocomplete from '$lib/components/base/Autocomplete.svelte'
	import SvelteSortable from 'sveltuse/dist/components/SvelteSortable.svelte'
	import { useStates } from 'sveltuse'
	import { goto } from '$app/navigation'
	import ProjectFormBasic from '$lib/components/project/ProjectFormBasic.svelte'
	import ProjectFormTechnologies from '$lib/components/project/ProjectFormTechnologies.svelte'

	export let data
	let { project, supabase, technologies } = data

	const nullableURL = z
		.union([z.string().length(0), z.string().url()])
		.nullable()
		.transform((e) => (!e?.trim() ? null : e))

	const projectSchema = z.object({
		name: z.string().min(1, 'Required.'),
		slug: z.string().min(1, 'Required.'),
		description: z.string().nullable(),
		previewUrl: nullableURL,
		sourceCodeUrl: nullableURL,
		status: z.boolean().default(false),
		technologies: z.array(
			z.object({
				technologies: z.object({
					id: z.string()
				})
			})
		)
	})

	type TProjectSchema = z.infer<typeof projectSchema>

	// const supabase = getSupabaseContext()

	const {
		errors,
		isSubmitting,
		data: values,
		form,
		setIsSubmitting,
		setFields,
		setData
	} = createForm<TProjectSchema>({
		extend: validator({ schema: projectSchema }),
		initialValues: {
			name: project?.name || '',
			slug: project?.slug || '',
			description: project?.description || null,
			previewUrl: project?.previewUrl || null,
			sourceCodeUrl: project?.sourceCodeUrl || null,
			status: project?.status === 'active'
		},
		async onSubmit(values, context) {
			if (!project) return

			console.log('onSubmit', { values })

			setIsSubmitting(true)
			const { data, error } = await supabase
				.from('projects')
				.update({
					name: values.name,
					slug: values.name.split(' ').join('-').trim().toLowerCase(),
					previewUrl: values.previewUrl,
					description: values.description,
					sourceCodeUrl: values.sourceCodeUrl,
					status: values.status ? 'active' : 'disabled'
				})
				.eq('id', project.id)

			await supabase
				.from('projectTechnologies')
				.delete()
				.in(
					'technologyId',
					project.projectTechnologies
						.filter((tech) => {
							return !values.technologies.some((item) => {
								return item.technologies.id === tech.technologies.id
							})
						})
						.map((v) => v.technologies.id)
				)

			await supabase.from('projectTechnologies').insert(
				values.technologies
					.filter((tech) => {
						return !project.projectTechnologies.some((item) => {
							return item.technologies.id === tech.technologies.id
						})
					})
					.map((tech) => ({
						projectId: project.id,
						technologyId: tech.technologies.id
					}))
			)

			setIsSubmitting(false)

			console.log({ data, error })
		}
	})

	const onRefreshRepository = async () => {
		if (!project) return

		if (project.repository) {
			console.log('repository', project.repository)
			return
		}

		if (!project.sourceCodeUrl) return

		const repositoryPath = project.sourceCodeUrl.split('/').slice(-2).join('/')
		const repository = await Github.getRepository(repositoryPath)

		console.log('repository', repository)

		const { data, error } = await supabase
			.from('projects')
			.update({ repository })
			.eq('id', project.id)
			.single()

		console.log('onRefreshRepository', error, data)
	}

	const Projects = useProjects()
	const fetchProject = async () => {
		const { error, data } = await Projects.get({
			slug: $page.params.slug
		})
		if (!error) project = data
	}

	let storageModal = false
	const onSelectAttachments: OnSelectHandlerMultiple = async (
		attachments,
		{ reset: clearSelected }
	) => {
		if (!project) return

		storageModal = false
		clearSelected()

		const sortOrder = await getNewSortOrder({
			add: 1,
			ascending: false,
			table: 'projectAttachments'
		})

		await supabase.from('projectAttachments').insert(
			attachments.map((attachment, index) => ({
				projectId: project.id,
				attachmentId: attachment.id,
				sortOrder: sortOrder + index
			}))
		)

		fetchProject()
	}

	$: {
		if (!$values.previewUrl && $values.previewUrl !== null) {
			console.log('setData')
			setData('previewUrl', null)
		}
	}

	const onDeleteProjectAttachment = (projectAttachment: TProjectAttachment) => async () => {
		if (confirm(`Are you sure to delete this attachment?`)) {
			await supabase.from('projectAttachments').delete().eq('id', projectAttachment.id)
			fetchProject()
		}
	}

	const onChangeProjectAttachmentSortOrder = async (newIndex: number) => {
		const { item: projectAttachment } = getAverageSortOrder(
			project?.projectAttachments || [],
			newIndex
		)

		const { error, data: updatedProjectAttachment } = await supabase
			.from('projectAttachments')
			.update({ sortOrder: projectAttachment.sortOrder })
			.eq('id', projectAttachment.id)
			.select('*,attachments(*)')
			.single()

		if (error) {
			console.log('onChangeProjectAttachmentSortOrder', { error })
			return
		}

		project.projectAttachments = project.projectAttachments.map((item) => {
			return item.id === updatedProjectAttachment.id
				? { ...item, sortOrder: updatedProjectAttachment.sortOrder }
				: item
		})
	}

	// ==> TAB
	const tabs = ['Basic', 'Technologies', 'Images', 'Preview', 'Repository'] as const
	const initialTab = (): typeof tabs[number] => {
		const queryTab = $page.url.searchParams.get('tab') as Maybe<typeof tabs[number]>
		if (queryTab && tabs.includes(queryTab)) return queryTab
		return 'Basic'
	}
	const currentTab = useStates(tabs, initialTab())
	const setCurrentTab = (tab: typeof tabs[number]) => () => {
		currentTab.set(tab)
		goto(`/admin/projects/${project?.slug || ''}?tab=${tab}`)
	}
	// <== TAB

	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

<div class="w-full max-w-4xl py-16 mx-auto">
	{#if project}
		<div>
			<h1 class="text-2xl font-medium">
				{project?.name}
			</h1>
		</div>

		<div class="mt-4">
			<div class="tabs tabs-boxed">
				{#each tabs as tab}
					<button class="tab" class:tab-active={$currentTab === tab} on:click={setCurrentTab(tab)}>
						{tab}
					</button>
				{/each}
			</div>
		</div>

		{#if $currentTab === 'Basic'}
			<ProjectFormBasic bind:project />
		{:else if $currentTab === 'Technologies'}
			<ProjectFormTechnologies bind:project class="mt-4" {technologies} />
		{:else if $currentTab === 'Images'}
			<div class="mt-4">
				<h2 class="font-medium text-lg">Project Images</h2>
				<div class="opacity-70">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptate eveniet
					ratione ut dicta! Earum ratione a molestiae pariatur, eius sed laudantium non, ipsam
					quidem facere odio ipsum obcaecati distinctio.
				</div>

				{#if project}
					<SvelteSortable
						bind:items={project.projectAttachments}
						options={{ animation: 150, draggable: '.attachment' }}
						onUpdated={onChangeProjectAttachmentSortOrder}
						class="grid 2xl:grid-cols-5 gap-4 mt-4"
					>
						{#each project.projectAttachments as projectAttachment}
							{@const src = getPublicUrl(projectAttachment.attachments)}
							<div class="relative attachment">
								<button
									class="btn btn-circle btn-error btn-sm absolute top-1 right-1"
									on:click={onDeleteProjectAttachment(projectAttachment)}
								>
									<Icon class="text-base" icon="mdi-delete-outline" />
								</button>
								<BaseImage
									class="h-36 w-full object-top object-cover rounded"
									lazySrc={src}
									alt={projectAttachment.attachments.name}
									src={projectAttachment.attachments.base64 || src}
								/>
							</div>
						{/each}
						<StoragePicker bind:modal={storageModal} onSelect={onSelectAttachments}>
							<button
								on:click={() => (storageModal = true)}
								class="h-36 grid place-items-center bg-base-100 rounded shadow"
							>
								<Icon class="text-7xl text-white text-opacity-20" icon="mdi-plus" />
							</button>
						</StoragePicker>
					</SvelteSortable>
				{/if}
			</div>
		{:else if $currentTab === 'Preview'}
			<TextField
				name="previewUrl"
				label="Preview URL"
				placeholder="Preview url.."
				errors={$errors.previewUrl || []}
			/>
			{#if values.previewUrl}
				<iframe
					title={values.name}
					src={values.previewUrl}
					frameborder="0"
					class="flex-1 w-full rounded-2xl h-96"
				/>
			{/if}
		{:else if $currentTab === 'Repository'}
			<TextField
				name="sourceCodeUrl"
				label="Source Code URL"
				placeholder="Preview url.."
				errors={$errors.sourceCodeUrl || []}
			/>
			<button type="button" class="btn btn-primary" on:click={onRefreshRepository}>
				Refresh Repository
			</button>
		{/if}
	{/if}
</div>

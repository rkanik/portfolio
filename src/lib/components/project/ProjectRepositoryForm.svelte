<script lang="ts">
	import type { Maybe, TGithubRepository, TProject, TTechnology } from '$lib/types'

	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import { useGlobalPageData } from '$lib/utils/useGlobalPageData'

	import z from 'zod'
	import Github from '$lib/utils/Github'
	import BaseForm from '$lib/components/base/BaseForm.svelte'
	import GithubRepository from '../GithubRepository.svelte'
	import type { TProfile } from '$lib/types/Profile'

	export let project: TProject
	const { supabase, technologies } = useGlobalPageData<{ technologies: TTechnology[] }>()

	const nullableURL = z
		.union([z.string().length(0), z.string().url()])
		.nullable()
		.transform((e) => (!e?.trim() ? null : e))

	const repositorySchema = z.object({
		sourceCodeUrl: nullableURL
	})

	type TRepositorySchema = z.infer<typeof repositorySchema>

	const toInitialValues = (v: Maybe<TProject>): TRepositorySchema => {
		return {
			sourceCodeUrl: v?.sourceCodeUrl ?? null
		}
	}

	const repositoryForm = createForm<z.infer<typeof repositorySchema>>({
		initialValues: toInitialValues(project),
		extend: validator({
			schema: repositorySchema
		}),
		async onSubmit(values) {
			if (!project) return

			repositoryForm.setIsSubmitting(true)
			const { error, data: updatedProject } = await supabase
				.from('projects')
				.update({
					sourceCodeUrl: values.sourceCodeUrl
				})
				.eq('id', project.id)
				.select('sourceCodeUrl')
				.single()
			repositoryForm.setIsSubmitting(false)

			if (error) {
				console.log('onSubmit:repositoryForm', { error })
				return
			}

			project = {
				...project,
				...updatedProject
			}
		}
	})

	const { profile } = useGlobalPageData<{ profile: TProfile }>()
	let githubAccessToken = profile?.github?.accessTokens?.[0]?.value || ''

	const onRefreshRepository = async () => {
		if (!project || !project.sourceCodeUrl) return

		const repositoryPath = project.sourceCodeUrl.split('/').slice(-2).join('/')
		const repository = await Github.getRepository(repositoryPath, githubAccessToken)

		const { data, error } = await supabase
			.from('projects')
			.update({ repository })
			.eq('id', project.id)
			.select('repository')
			.single()

		if (error) {
			console.log('onRefreshRepository', { error })
			return
		}

		project = {
			...project,
			...(data as unknown as TGithubRepository)
		}
	}

	const { isSubmitting } = repositoryForm
</script>

<BaseForm
	hideCancelButton
	form={repositoryForm}
	class={$$props.class}
	loading={$isSubmitting}
	submitButtonText="Save Changes"
	actionsClass="mt-8 col-span-12"
	fields={[
		{
			type: 'text',
			name: 'sourceCodeUrl',
			label: 'Repository URL',
			class: 'col-span-12',
			placeholder: 'Enter github repository url if have any'
		}
	]}
>
	<svelte:fragment slot="bottom">
		<div class="col-span-12">
			{#if profile}
				<select bind:value={githubAccessToken}>
					{#each profile.github.accessTokens as token}
						<option value={token.value}>{token.name}</option>
					{/each}
				</select>
			{/if}
			<button
				type="button"
				class="btn btn-outline normal-case btn-sm btn-primary"
				on:click={onRefreshRepository}
			>
				Refresh Repository
			</button>

			<GithubRepository
				repository={project.repository}
				class="bg-base-100 rounded p-4 mt-4 max-w-lg w-full flex flex-col space-y-4"
			/>
		</div>
	</svelte:fragment>
</BaseForm>

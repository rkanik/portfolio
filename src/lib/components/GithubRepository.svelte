<script lang="ts">
	import type { Nullable, TGithubRepository, TTechnology, TUserTechnology } from '$lib/types'
	import { useGlobalPageData } from '$lib/utils/useGlobalPageData'

	export let repository: Nullable<TGithubRepository> = null

	type Language = {
		color: string
		value: number
		language: string
		percentage: number
	}

	type LanguageColor = {
		language: string
		color: string
	}

	let languageColors: LanguageColor[] = []

	const { technologies, userTechnologies } = useGlobalPageData<{
		technologies?: TTechnology[]
		userTechnologies?: TUserTechnology[]
	}>()

	const technologyToLanguageColor = (technology: TTechnology): LanguageColor => {
		return {
			color: technology.color,
			language: technology.name
		}
	}

	const getLanguageColor = (language: string) => {
		return languageColors.find((item) => {
			return (
				item.language.toLowerCase().includes(language.toLowerCase()) ||
				language.toLowerCase().includes(item.language.toLowerCase())
			)
		})
	}

	$: if (technologies) {
		languageColors = technologies.map(technologyToLanguageColor)
	}
	$: if (userTechnologies) {
		languageColors = userTechnologies.map((v) => {
			return technologyToLanguageColor(v.technologies)
		})
	}

	let languages: Language[] = []

	$: {
		let entries = Object.entries(repository?.languages || {})
		let total = entries.reduce((sum, [_, value]) => sum + value, 0)
		languages = entries.map(([language, value]) => {
			const color = getLanguageColor(language)?.color || 'black'
			return {
				value,
				color,
				language,
				percentage: (value / total) * 100
			}
		})
	}

	const toArray = <T>(v: T): T => {
		return (Array.isArray(v) ? v : []) as T
	}
</script>

<div class={$$props.class}>
	{#if repository}
		<div>
			<div class="uppercase text-secondary text-xs mb-1 tracking-wider">
				Name
				{#if repository.private}
					<div class="badge badge-xs normal-case text-xs">Private</div>
				{/if}
			</div>
			<div class="flex flex-wrap -ml-1 mt-2">
				<a href={repository.html_url} class="text-blue-500 hover:underline text-base font-medium"
					>{repository.full_name}</a
				>
			</div>
		</div>

		<div class="flex-none">
			<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Owner</div>
			<div class="flex flex-wrap -ml-1 mt-2">
				<div class="tooltip" data-tip={`@${repository.owner.login}`}>
					<a href={repository.owner.html_url} target="_blank" rel="noreferrer" class="ml-1 mt-1">
						<div class="avatar">
							<div class="w-8 rounded-full">
								<img src={repository.owner.avatar_url} alt={repository.owner.login} />
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>

		{#if repository.description}
			<div>
				<div class="uppercase text-secondary text-xs mb-1 tracking-wider">About</div>
				<div class="flex flex-wrap -ml-1 mt-2">
					{repository.description}
				</div>
			</div>
		{/if}

		<div>
			<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Contributors</div>
			<div class="flex flex-wrap -ml-1 mt-2">
				{#each toArray(repository.contributors) as contributor}
					<div class="tooltip" data-tip={`@${contributor.login}`}>
						<a href={contributor.html_url} target="_blank" rel="noreferrer" class="ml-1 mt-1">
							<div class="avatar">
								<div class="w-8 rounded-full">
									<img src={contributor.avatar_url} alt={contributor.login} />
								</div>
							</div>
						</a>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Languages</div>
			<div class="mt-2">
				<div class="flex w-full h-2 bg-base-100 rounded-full overflow-hidden">
					{#each toArray(languages) as language}
						<div
							class="h-2"
							style="width: {language.percentage}%;background-color:{language.color}"
						/>
					{/each}
				</div>

				<div class="mt-2 flex flex-wrap -ml-2">
					{#each toArray(languages) as language}
						<div class="flex items-center space-x-2 ml-2 mt-2">
							<div class="h-2 w-2 rounded-full" style="background-color:{language.color}" />
							<div class="text-sm font-medium">{language.language}</div>
							<div class="text-xs text-opacity-40 text-white font-normal">
								{language.percentage.toFixed(1)}%
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

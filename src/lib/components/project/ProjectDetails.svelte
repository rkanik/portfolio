<script lang="ts">
	import type { TProject, TUserTechnology } from '$lib/types'

	import Icon from '@iconify/svelte'
	import useRequestFullscreen from '$lib/composable/useRequestFullscreen'
	import src from '$lib/utils/src'

	export let project: TProject
	export let userTechnologies: TUserTechnology[] = []

	let iframe: HTMLIFrameElement
	let iframeFullscreen = useRequestFullscreen(() => {
		return iframe
	})

	const onRequestFullscreen = () => {
		iframeFullscreen.show()
	}

	let languages: {
		color: string
		value: number
		language: string
		percentage: number
	}[] = []

	$: {
		let entries = Object.entries(project.repository?.languages || {})
		let total = entries.reduce((sum, [_, value]) => sum + value, 0)
		languages = entries.map(([language, value]) => {
			const color =
				userTechnologies.find((v) => {
					return v.technologies.name === language.toLowerCase()
				})?.technologies.color || 'black'
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

<div class="flex min-h-[80vh] space-x-5">
	<div class="flex flex-col flex-1">
		{#if project.previewUrl}
			<iframe
				bind:this={iframe}
				title={project.name}
				src={project.previewUrl}
				frameborder="0"
				class="flex-1 w-full rounded-2xl"
			/>
		{:else}
			<div>
				<img
					alt={project.name}
					src={src(project.projectAttachments?.[0]?.attachments?.thumbnail)}
					class="object-cover w-full h-full rounded-2xl"
				/>
			</div>
		{/if}
	</div>
	<div class="flex-none max-w-sm w-full">
		<div class="flex items-center flex-none p-2 mb-5 rounded-2xl bg-base-100">
			<div class="px-2 text-base font-medium">Project Details</div>
			<div class="flex ml-auto space-x-1">
				{#if project.previewUrl}
					<div class="tooltip tooltip-left tooltip-primary" data-tip="Enter to fullscreen">
						<button class="btn btn-circle btn-sm" on:click={onRequestFullscreen}>
							<Icon class="text-xl" icon="iconamoon:screen-full" />
						</button>
					</div>
				{/if}
				{#if project.sourceCodeUrl}
					<div class="tooltip tooltip-left tooltip-primary" data-tip="View source code">
						<a
							href={project.sourceCodeUrl}
							target="_blank"
							rel="noreferrer"
							class="btn btn-circle btn-sm"
						>
							<Icon class="text-xl" icon="material-symbols:code" />
						</a>
					</div>
				{/if}
				<div class="tooltip tooltip-left tooltip-primary" data-tip="Open in new tab">
					<a
						href={project.previewUrl}
						target="_blank"
						rel="noreferrer"
						class="btn btn-circle btn-sm"
					>
						<Icon class="text-xl" icon="material-symbols:open-in-new-rounded" />
					</a>
				</div>

				<div class="tooltip tooltip-left tooltip-primary" data-tip="Close modal">
					<button class="btn btn-circle btn-sm" on:click={close}>
						<Icon class="text-xl" icon="mdi:close" />
					</button>
				</div>
			</div>
		</div>

		<div class="p-5 bg-base-100 rounded-2xl space-y-6">
			<div>
				<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Name</div>
				<h4>
					{project.name}
				</h4>
			</div>

			<div>
				<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Description</div>
				<p>
					{project.description}
				</p>
			</div>

			{#if project.sourceCodeUrl}
				<div>
					<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Source Code</div>
					<a
						href={project.sourceCodeUrl}
						target="_blank"
						rel="noreferrer"
						class="hover:underline text-blue-500"
					>
						{project.sourceCodeUrl}
					</a>
				</div>
			{/if}

			{#if project.previewUrl}
				<div>
					<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Website</div>
					<a
						href={project.previewUrl}
						target="_blank"
						rel="noreferrer"
						class="hover:underline text-blue-500"
					>
						{project.previewUrl}
					</a>
				</div>
			{/if}

			<div>
				<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Technologies</div>
				<div class="flex flex-wrap max-w-xs -mt-1 -ml-1">
					{#if Array.isArray(project.projectTechnologies)}
						{#each project.projectTechnologies as item}
							<div class="badge ml-1 mt-1 pb-0.5 space-x-1 items-center">
								<Icon icon={item.technologies?.icon} class="text-sm mt-0.5" />
								<div>{item.technologies?.name}</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			{#if project.repository}
				<div>
					<div class="uppercase text-secondary text-xs mb-1 tracking-wider">Contributors</div>
					<div class="flex flex-wrap -ml-1 mt-2">
						{#each toArray(project.repository.contributors) as contributor}
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
	</div>
</div>

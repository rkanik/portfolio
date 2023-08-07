<script lang="ts">
	import type { AnyFn } from '$lib/types'
	import type { TProfileGithub, TResume } from '$lib/types/Profile'

	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import { useDebounceFn } from 'sveltuse'
	import Resizable from '$lib/components/Resizable.svelte'
	import TextField from '$lib/components/base/TextField.svelte'
	import TextArea from '$lib/components/base/TextArea.svelte'
	import FormControl from '$lib/components/base/FormControl.svelte'
	import Input from '$lib/components/base/Input.svelte'
	import Icon from '@iconify/svelte'
	import ResumeCollapse from '$lib/components/resume/ResumeCollapse.svelte'

	export let data

	$: user = data.user
	$: supabase = data.supabase

	let github: TProfileGithub = data.profile?.github || {
		accessTokens: [{ name: '', value: '' }]
	}

	let resume: TResume = data.profile?.resume || {
		name: '',
		emails: [],
		phones: [],
		presentAddress: '',
		educations: []
	}

	const onSaveResume = async (resume: TResume) => {
		if (!user) return
		const response = await supabase
			.from('profiles')
			.update({ resume })
			.eq('id', user.id)
			.select('*')
			.single()
		console.log('onSaveResume', response)
	}

	const onChangeResume = useDebounceFn(onSaveResume, 5000)
	// $: onChangeResume(resume)

	const setResume = (updater: AnyFn) => {
		updater(resume)
		resume = resume
	}

	const setResumeCb: any = (updater: AnyFn) => {
		return setResume(updater)
	}
</script>

<div class="flex flex-1 overflow-hidden">
	<Resizable class="border-r border-base-100 min-w-[320px] max-w-xl flex flex-col overflow-hidden">
		<div class="space-y-4 flex-1 overflow-auto p-5">
			<FormControl let:attrs id="name" label="Name" labelClass="p-0 mb-1">
				<Input
					{...attrs}
					bind:value={resume.name}
					placeholder="Your full name..."
					class="input-sm rounded bg-base-200 border-base-100"
				/>
			</FormControl>

			<FormControl let:attrs id="presentAddress" label="Present address" labelClass="p-0 mb-1">
				<textarea
					{...attrs}
					bind:value={resume.presentAddress}
					rows="2"
					placeholder="Your full present address..."
					class="textarea textarea-sm textarea-bordered border-solid rounded bg-base-200 border-base-100"
				/>
			</FormControl>

			<ResumeCollapse
				title="Emails"
				on:plus={setResumeCb(() => {
					resume.emails.push({ value: '' })
				})}
			>
				<div class="space-y-2 p-3">
					{#each resume.emails as email, index}
						<div class="flex items-center space-x-1 relative group">
							<FormControl let:attrs id="email-{index}" labelClass="p-0 mb-1" class="flex-1">
								<Input
									{...attrs}
									bind:value={email.value}
									placeholder="Email address..."
									class="input-sm rounded bg-base-200 border-base-100"
								/>
							</FormControl>
							<button
								on:click|preventDefault|stopPropagation={setResumeCb(() => {
									resume.emails.splice(index, 1)
								})}
								class="absolute right-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition hover:text-red-500"
							>
								<Icon icon="mdi:close" />
							</button>
						</div>
					{/each}
				</div>
			</ResumeCollapse>

			<ResumeCollapse
				title="Phones"
				on:plus={setResumeCb(() => {
					resume.phones.push({ value: '' })
				})}
			>
				<div class="space-y-2 p-3">
					{#each resume.phones as phone, index}
						<div class="flex items-center space-x-1 group relative">
							<FormControl let:attrs id="phone-{index}" labelClass="p-0 mb-1" class="flex-1">
								<Input
									{...attrs}
									bind:value={phone.value}
									type="tel"
									placeholder="Phone number..."
									class="input-sm rounded bg-base-200 border-base-100"
								/>
							</FormControl>
							<button
								on:click|preventDefault|stopPropagation={setResumeCb(() => {
									resume.phones.splice(index, 1)
								})}
								class="absolute right-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition hover:text-red-500"
							>
								<Icon icon="mdi:close" />
							</button>
						</div>
					{/each}
				</div>
			</ResumeCollapse>

			<ResumeCollapse
				title="Educations"
				on:plus={setResumeCb(() => {
					if (!resume.educations) {
						resume.educations = []
					}
					resume.educations.push({
						year: 0,
						title: '',
						lines: []
					})
				})}
			>
				<div class="space-y-2 p-3">
					{#each resume.educations || [] as education, index}
						<ResumeCollapse hidePlus title={education.title || `Educations ${index + 1}`}>
							<div class="p-3 grid gap-3 grid-cols-12">
								<FormControl
									let:attrs
									class="col-span-9"
									labelClass="p-0 mb-1"
									id="education-{index}-title"
								>
									<Input
										{...attrs}
										bind:value={education.title}
										placeholder="Title..."
										class="input-sm rounded bg-base-200 border-base-100"
									/>
								</FormControl>
								<FormControl
									let:attrs
									class="col-span-3"
									labelClass="p-0 mb-1"
									id="education-{index}-year"
								>
									<Input
										{...attrs}
										bind:value={education.year}
										type="number"
										placeholder="Year"
										class="input-sm rounded bg-base-200 border-base-100"
									/>
								</FormControl>
								<FormControl
									let:attrs
									class="col-span-12"
									labelClass="p-0 mb-1"
									id="education-{index}-line1"
								>
									<Input
										{...attrs}
										bind:value={education.lines[0]}
										placeholder="Line one..."
										class="input-sm rounded bg-base-200 border-base-100"
									/>
								</FormControl>
								<FormControl
									let:attrs
									class="col-span-12"
									labelClass="p-0 mb-1"
									id="education-{index}-line2"
								>
									<Input
										{...attrs}
										bind:value={education.lines[1]}
										placeholder="Line two..."
										class="input-sm rounded bg-base-200 border-base-100"
									/>
								</FormControl>
							</div>
						</ResumeCollapse>
					{/each}
				</div>
			</ResumeCollapse>

			<button class="btn btn-primary btn-sm" on:click={() => onSaveResume(resume)}> Save </button>
		</div>
	</Resizable>

	<div class="flex-1">
		<!-- <div class="resume w-[816px] mx-auto p-20 shadow-2xl mt-20 bg-white text-black">
			<h1>
				<input
					type="text"
					bind:value={resume.name}
					class="bg-neutral-100 text-black w-full text-xl"
				/>
			</h1>
			<p>
				<input type="text" bind:value={resume.name} class="bg-neutral-100 text-black w-full" />
			</p>

			<div class="mt-16" />
			<BaseJson
				data={{
					github,
					user: data.user,
					profile: data.profile
				}}
			/>
		</div> -->
	</div>
</div>

<style lang="scss">
	.resume {
		font-family: 'Times New Roman', Times, serif;
		h1,
		h2,
		h3 {
			font-weight: bold;
		}
	}
</style>

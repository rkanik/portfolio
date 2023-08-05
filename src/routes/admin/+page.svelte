<script lang="ts">
	import { enhance } from '$app/forms'
	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import type { TProfileGithub } from '$lib/types/Profile'

	export let data

	$: user = data.user
	$: supabase = data.supabase

	let github: TProfileGithub = data.profile?.github || {
		accessTokens: [{ name: '', value: '' }]
	}

	const setGithub = (cb: (v: TProfileGithub) => void) => {
		cb(github)
		github = github
	}

	const onSaveChanges = async () => {
		const res = await supabase
			.from('profiles')
			.update({ github })
			.eq('id', user?.id)
			.select('*')
			.single()
		console.log('onSaveChanges:res', res)
	}

	const onPrintPDF = () => {}
</script>

<svelte:head>
	<title>Dashboard | Rasel Khandkar</title>
</svelte:head>

<div class="p-5">
	<form action="?/printPDF" method="post" use:enhance={({ form, action }) => {}}>
		<button type="submit">Print pdf</button>
	</form>

	<form class="max-w-lg w-full mx-auto p-4 bg-base-200 shadow-2xl rounded-lg">
		<h2>Github</h2>
		<h4>Access Tokens</h4>
		<div class="space-y-1">
			{#each github.accessTokens as accessToken, index}
				<div class="flex items-center space-x-1">
					<input
						type="text"
						class="flex-1 px-1"
						bind:value={accessToken.name}
						placeholder="Enter token name"
					/>
					<input
						type="text"
						class="flex-1 px-1"
						bind:value={accessToken.value}
						placeholder="Enter Token value"
					/>
					<button
						type="button"
						class="flex-none"
						on:click={() => {
							if (confirm('Are you sure?')) {
								setGithub((github) => {
									github.accessTokens.splice(index, 1)
								})
							}
						}}>x</button
					>
				</div>
			{/each}
		</div>
		<div class="flex items-center justify-end space-x-2">
			<button
				type="button"
				on:click={() => {
					setGithub((github) => {
						github.accessTokens.push({ name: '', value: '' })
					})
				}}>Add</button
			>
			<button type="button" on:click={onSaveChanges}>Save</button>
		</div>
	</form>

	<div class="mt-16" />
	<BaseJson
		data={{
			github,
			user: data.user,
			profile: data.profile
		}}
	/>
</div>

<script lang="ts">
	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import BaseDataTable from '$lib/components/base/BaseDataTable.svelte'
	import BaseActionsDropdown from '$lib/components/base/BaseActionsDropdown.svelte'
	import Icon from '@iconify/svelte'
	import src from '$lib/utils/src'
	import d from '$lib/utils/dayjs'
	import cn from '$lib/utils/cn'
	import get from 'lodash/get'
	import BaseModal from '$lib/components/base/BaseModal.svelte'
	import TestimonialForm from '$lib/components/forms/TestimonialForm.svelte'

	export let data

	const {
		testimonials: { error, data: testimonials }
	} = data

	$: {
		console.log(testimonials)
	}

	let modal = false
</script>

<svelte:head>
	<title>Testimonials | Rasel Khandkar</title>
</svelte:head>

{#if error}
	<div class="text-error">Error</div>
	<BaseJson data={error} />
{:else}
	<div class="container px-4 py-4 mx-auto md:px-0 md:py-5">
		<div class="flex items-center justify-between py-2">
			<h1 class="text-2xl font-medium">Testimonials</h1>

			<BaseModal
				bind:value={modal}
				title="Create new project"
				activator={{ class: 'btn btn-sm btn-primary', text: 'New Testimonial' }}
			>
				<TestimonialForm
					on:created={(e) => {
						modal = false
						testimonials.data = [e.detail, ...testimonials.data]
					}}
				/>
			</BaseModal>

			<!-- 

			<BaseModal bind:value={updateModal} title="Update Project" activator={false}>
				<BaseFormOld
					bind:data={currentProject}
					fields={form.update.fields}
					on:submit={onUpdate}
					on:cancel={onResetUpdate}
				/>
			</BaseModal> -->
		</div>
		<div class="w-full mt-5 overflow-x-auto">
			<BaseDataTable
				actions
				items={testimonials.data}
				headers={[
					{ text: 'Name', value: 'name' },
					{ text: 'Company', value: 'company' },
					{ text: 'Testimonial', value: 'testimonial' },
					{ text: 'Rating', value: 'rating' },
					{ text: 'Status', value: 'status' },
					{ text: 'Created', value: 'createdAt' },
					{ text: 'Updated', value: 'updatedAt' }
				]}
				let:item
				let:header
			>
				<div slot="item">
					{#if header.value === 'technologies'}
						<!--  -->
					{:else if header.value === 'name'}
						<div class="flex items-center py-2 space-x-4">
							<div class="avatar placeholder">
								<div class="bg-neutral-focus text-neutral-content rounded-full w-8">
									<span class="text-xs uppercase">{item.testimonials.name.substring(0, 2)}</span>
								</div>
							</div>
							<div>
								<div class="whitespace-nowrap">{item.testimonials.name}</div>
							</div>
						</div>
					{:else if header.value === 'rating'}
						<div class="rating">
							{#each [...Array(5).keys()] as index}
								<input
									type="radio"
									name={`rating-${item.id}`}
									class="mask mask-star bg-orange-400"
									checked={index === item.testimonials.rating - 1}
									disabled
								/>
							{/each}
						</div>
					{:else if header.value === 'company'}
						<div class="whitespace-nowrap">
							{item.testimonials.company}
						</div>
					{:else if header.value === 'createdAt'}
						<div class="whitespace-nowrap">
							{d.utc(item.createdAt).format('DD MMM YYYY HH:mma')}
						</div>
					{:else if header.value === 'updatedAt'}
						<div class="whitespace-nowrap">
							{d.utc(item.updatedAt).format('DD MMM YYYY HH:mma')}
						</div>
					{:else if header.value === 'testimonial'}
						<div class="max-w-sm truncate">
							{item.testimonials.testimonial}
						</div>
					{:else if header.value === 'status'}
						<div
							class={cn('badge', {
								'badge-primary': item.testimonials.status === 'active'
							})}
						>
							{item.testimonials.status}
						</div>
					{:else}
						<div>
							{get(item, header.value)}
						</div>
					{/if}
				</div>

				<div slot="actions">
					<BaseActionsDropdown
						{item}
						actions={[
							{ text: 'View', event: 'view', icon: 'ic:baseline-remove-red-eye' },
							{
								text: 'Update',
								href: `/admin/projects/${item.slug}`,
								icon: 'ph:pencil'
							},
							{
								event: 'status',
								text: item.status === 'active' ? 'Disable Project' : 'Enable',
								icon: 'material-symbols:do-not-disturb-on-outline'
							},
							{ divider: true },
							{ text: 'Delete', event: 'delete', icon: 'ic:outline-delete' }
						]}
					/>
					<!-- on:update={onInitUpdate}
					on:status={onToggleStatus} -->
				</div>
			</BaseDataTable>
		</div>
	</div>
{/if}

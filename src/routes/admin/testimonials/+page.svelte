<script lang="ts">
	import type { Maybe, TTestimonial } from '$lib/types'

	import BaseJson from '$lib/components/base/BaseJson.svelte'
	import BaseModal from '$lib/components/base/BaseModal.svelte'
	import BaseDataTable from '$lib/components/base/BaseDataTable.svelte'
	import TestimonialForm from '$lib/components/forms/TestimonialForm.svelte'
	import BaseActionsDropdown from '$lib/components/base/BaseActionsDropdown.svelte'

	import get from 'lodash/get'
	import cn from '$lib/utils/cn'
	import d from '$lib/utils/dayjs'

	import { useTimeoutFn } from 'sveltuse'
	import { getPublicUrl } from '$lib/utils/getPublicUrl'
	import { useTestimonialModule } from '$lib/modules/testimonial.js'
	import TestimonialCard from '$lib/components/testimonial/TestimonialCard.svelte'

	export let data

	const {
		testimonials: { error, data: testimonials }
	} = data

	let modal = false

	let modalVisible = false
	let modalVisibleTimeout = useTimeoutFn(() => {
		modalVisible = false
		currentTestimonial = undefined
	}, 750)

	$: {
		if (modal) {
			modalVisible = true
			modalVisibleTimeout.stop()
		} else {
			modalVisibleTimeout.start()
		}
	}

	let currentTestimonial: Maybe<TTestimonial>

	const onInitUpdate = (event: CustomEvent<TTestimonial>) => {
		currentTestimonial = { ...event.detail }
		modal = true
	}

	const Testimonial = useTestimonialModule()

	const onInitDelete = async (event: CustomEvent<TTestimonial>) => {
		if (confirm('Are you sure to confirm this testimonial')) {
			const { error, data } = await Testimonial.delete(event.detail.id)

			if (error) {
				console.log('onInitDelete', { error })
				return
			}

			testimonials.data = testimonials.data.filter((item) => {
				return !data.some((v) => v.id === item.id)
			})
		}
	}

	let viewModal = false
	$: if (!viewModal) {
		currentTestimonial = undefined
	}

	const onInitView = (event: CustomEvent<TTestimonial>) => {
		currentTestimonial = { ...event.detail }
		viewModal = true
	}
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
				let:close
				bind:value={modal}
				modalBox="overflow-visible"
				title={currentTestimonial ? 'Update Testimonial' : 'Create new Testimonial'}
				activator={{ class: 'btn btn-sm btn-primary', text: 'New Testimonial' }}
			>
				{#if modalVisible}
					<TestimonialForm
						value={currentTestimonial}
						onClose={close}
						on:created={(e) => {
							modal = false
							testimonials.data = [e.detail, ...testimonials.data]
						}}
						on:updated={(e) => {
							modal = false
							testimonials.data = testimonials.data.map((item) => {
								return item.id === e.detail.id ? e.detail : item
							})
						}}
					/>
				{/if}
			</BaseModal>
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
									{#if item.avatar}
										<img alt={item.avatar?.name} src={getPublicUrl(item.avatar)} />
									{:else}
										<span class="text-xs uppercase">{item.name.substring(0, 2)}</span>
									{/if}
								</div>
							</div>
							<div>
								<div class="whitespace-nowrap">{item.name}</div>
							</div>
						</div>
					{:else if header.value === 'rating'}
						<div class="rating">
							{#each [...Array(5).keys()] as index}
								<input
									type="radio"
									name={`rating-${item.id}`}
									class="mask mask-star bg-orange-400"
									checked={index === item.rating - 1}
									disabled
								/>
							{/each}
						</div>
					{:else if header.value === 'company'}
						<div class="whitespace-nowrap">
							{item.company}
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
							{item.testimonial}
						</div>
					{:else if header.value === 'status'}
						<div
							class={cn('badge', {
								'badge-primary': item.status === 'active'
							})}
						>
							{item.status}
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
								event: 'update',
								icon: 'ph:pencil'
							},
							// {
							// 	event: 'status',
							// 	text: item.status === 'active' ? 'Disable Project' : 'Enable',
							// 	icon: 'material-symbols:do-not-disturb-on-outline'
							// },
							{ divider: true },
							{ text: 'Delete', event: 'delete', icon: 'ic:outline-delete' }
						]}
						on:view={onInitView}
						on:update={onInitUpdate}
						on:delete={onInitDelete}
					/>
				</div>
			</BaseDataTable>
		</div>

		<BaseModal
			bind:value={viewModal}
			title="Testimonial"
			activator={false}
			modalBox="overflow-visible"
		>
			{#if currentTestimonial}
				<TestimonialCard testimonial={currentTestimonial} />
			{/if}
		</BaseModal>
	</div>
{/if}

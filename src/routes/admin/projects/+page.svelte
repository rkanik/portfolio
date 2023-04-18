<script lang="ts">
	import BaseForm from '$lib/components/base/BaseForm.svelte'
	import BaseModal from '$lib/components/base/BaseModal.svelte'
	import { getSupabaseContext } from '$lib/store/useSupabase'
	import { resizeImage, resizeImages } from '$lib/utils/resizeImage'
	import useSupabaseStorage, { type SupabaseFile } from '$lib/utils/useSupabaseStorage'

	const form = {
		update: {
			data: {
				name: '',
				description: '',
				previewUrl: '',
				sourceCodeUrl: '',
				tags: [],
				attachments: []
			} as any
		},
		create: {
			data: {
				name: '',
				description: '',
				previewUrl: '',
				sourceCodeUrl: '',
				tags: [],
				attachments: []
			} as {
				name: string
				description: string
				previewUrl: string
				sourceCodeUrl: string
				tags: { name: string }[]
				attachments: FileList | File[]
			},
			fields: [
				{
					name: 'name',
					type: 'text',
					label: 'Name',
					placeholder: 'Enter the name of the project'
				},
				{
					name: 'previewUrl',
					type: 'text',
					label: 'Preview URL',
					prefix: 'https://',
					placeholder: 'Live preview url of the project'
				},
				{
					name: 'sourceCodeUrl',
					type: 'text',
					label: 'Source code URL',
					prefix: 'https://',
					placeholder: 'Open source code url like github or gitlab.'
				},
				{
					name: 'description',
					type: 'textarea',
					label: 'Description',
					placeholder: 'Write project description...'
				},
				{
					name: 'attachments',
					type: 'file',
					multiple: true,
					accept: 'image/*',
					label: 'Attachments',
					placeholder: 'Choose attachments'
				},
				{
					name: 'tags',
					type: 'combobox',
					label: 'Tags',
					placeholder: 'Write tags...',
					options: []
				}
			] as any[]
		}
	}

	let modal = false
	const supabase = getSupabaseContext()
	const storage = useSupabaseStorage($supabase)

	const onSubmit = async (event: CustomEvent<typeof form.create.data>) => {
		event.preventDefault()
		try {
			// const file = await $supabase.storage
			// 	.from('uploads')
			// 	.createSignedUrl('projects/eg778sutz6mtw3q4ze3r5.jpg', 3.156e9, {
			// 		transform: {
			// 			width: 64,
			// 			height: 64,
			// 			resize: 'cover'
			// 		}
			// 	})
			// console.log(file)
			// const url = $supabase.storage
			// 	.from('uploads')
			// 	.getPublicUrl('projects/eg778sutz6mtw3q4ze3r5.jpg', {
			// 		transform: {
			// 			width: 400
			// 		}
			// 	})
			// console.log('url', url)
			// const attachments = await Promise.all(
			// 	Array.from(event.detail.attachments).map(async (file) => {
			// 		return {
			// 			file,
			// 			src: await resizeImage(file, { maxWidth: 1200 }),
			// 			thumbnail: await resizeImage(file, { maxWidth: 400 }),
			// 			base64: await resizeImage(file, { maxWidth: 3 })
			// 		}
			// 	})
			// )
			// const supabaseUploadRes = await storage.uploadMany(
			// 	attachments.reduce((carry, attachment) => {
			// 		return carry.concat([
			// 			{
			// 				path: 'projects',
			// 				bucket: 'uploads',
			// 				file: attachment.file
			// 			}
			// 		])
			// 	}, [] as SupabaseFile[])
			// )
			// console.log('supabaseUploadRes', supabaseUploadRes)

			console.log(
				$supabase.storage.from('uploads').getPublicUrl('projects/w49g_mpo_po9xpjjkcyrl.jpg', {
					transform: {
						width: 400,
						height: 400,
						resize: 'cover'
					}
				}).data.publicUrl
			)

			// const project = await trpc().projects.create.mutate({
			// 	...event.detail,
			// 	attachments: await createCustomFiles(event.detail.attachments, {
			// 		dir: `static/uploads/projects/{id}`,
			// 		name: `PROJECT_{id}_ATTACHMENT_{date}.{ext}`
			// 	}),
			// 	tags: event.detail.tags.map((tag: any) => {
			// 		return { id: tag.id, name: tag.name }
			// 	})
			// })
			// if (project) {
			// 	modal = false
			// 	projects = [project, ...projects]
			// 	form.create.data = {
			// 		name: '',
			// 		description: '',
			// 		previewUrl: '',
			// 		sourceCodeUrl: '',
			// 		tags: [],
			// 		attachments: []
			// 	}
			// }
		} catch (error) {
			console.log('onSubmit', error)
		}
	}
</script>

<svelte:head>
	<title>Projects | RK Anik</title>
</svelte:head>

<div class="container px-4 py-4 mx-auto md:px-0 md:py-5">
	<div class="flex items-center justify-between py-2">
		<h1 class="text-2xl font-medium">Projects</h1>

		<BaseModal
			bind:value={modal}
			title="Create new project"
			activator={{ class: 'btn btn-sm btn-primary', text: 'New Project' }}
		>
			<BaseForm
				bind:data={form.create.data}
				fields={form.create.fields}
				on:submit={onSubmit}
				on:cancel={() => (modal = false)}
			/>
		</BaseModal>
	</div>
	<div class="w-full mt-5 overflow-x-auto">
		{$supabase.storage.from('uploads').getPublicUrl('projects/eg778sutz6mtw3q4ze3r5.jpg', {
			transform: {
				width: 400,
				height: 400,
				resize: 'cover'
			}
		}).data.publicUrl}
		<!-- {$supabase.storage
			.from('uploads')
			.createSignedUrl('projects/eg778sutz6mtw3q4ze3r5.jpg', 60000, {
				transform: {
					width: 200,
					height: 200
				}
			}).data.publicUrl} -->
		<img
			src={$supabase.storage.from('uploads').getPublicUrl('projects/eg778sutz6mtw3q4ze3r5.jpg', {
				transform: {
					width: 400,
					height: 400,
					resize: 'cover'
				}
			}).data.publicUrl}
			alt=""
		/>
		<table class="table w-full">
			<!-- head -->
			<thead>
				<tr>
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
					<th>Name</th>
					<th>Job</th>
					<th>Favorite Color</th>
					<th />
				</tr>
			</thead>
			<tbody>
				<!-- row 1 -->
				<tr>
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
					<td>
						<div class="flex items-center space-x-3">
							<div class="avatar">
								<div class="w-12 h-12 mask mask-squircle">
									<img
										src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
										alt="Avatar Tailwind CSS Component"
									/>
								</div>
							</div>
							<div>
								<div class="font-bold">Hart Hagerty</div>
								<div class="text-sm opacity-50">United States</div>
							</div>
						</div>
					</td>
					<td>
						Zemlak, Daniel and Leannon
						<br />
						<span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
					</td>
					<td>Purple</td>
					<th>
						<button class="btn btn-ghost btn-xs">details</button>
					</th>
				</tr>
				<!-- row 2 -->
				<tr>
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
					<td>
						<div class="flex items-center space-x-3">
							<div class="avatar">
								<div class="w-12 h-12 mask mask-squircle">
									<img
										src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
										alt="Avatar Tailwind CSS Component"
									/>
								</div>
							</div>
							<div>
								<div class="font-bold">Brice Swyre</div>
								<div class="text-sm opacity-50">China</div>
							</div>
						</div>
					</td>
					<td>
						Carroll Group
						<br />
						<span class="badge badge-ghost badge-sm">Tax Accountant</span>
					</td>
					<td>Red</td>
					<th>
						<button class="btn btn-ghost btn-xs">details</button>
					</th>
				</tr>
				<!-- row 3 -->
				<tr>
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
					<td>
						<div class="flex items-center space-x-3">
							<div class="avatar">
								<div class="w-12 h-12 mask mask-squircle">
									<img
										src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
										alt="Avatar Tailwind CSS Component"
									/>
								</div>
							</div>
							<div>
								<div class="font-bold">Marjy Ferencz</div>
								<div class="text-sm opacity-50">Russia</div>
							</div>
						</div>
					</td>
					<td>
						Rowe-Schoen
						<br />
						<span class="badge badge-ghost badge-sm">Office Assistant I</span>
					</td>
					<td>Crimson</td>
					<th>
						<button class="btn btn-ghost btn-xs">details</button>
					</th>
				</tr>
				<!-- row 4 -->
				<tr>
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
					<td>
						<div class="flex items-center space-x-3">
							<div class="avatar">
								<div class="w-12 h-12 mask mask-squircle">
									<img
										src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
										alt="Avatar Tailwind CSS Component"
									/>
								</div>
							</div>
							<div>
								<div class="font-bold">Yancy Tear</div>
								<div class="text-sm opacity-50">Brazil</div>
							</div>
						</div>
					</td>
					<td>
						Wyman-Ledner
						<br />
						<span class="badge badge-ghost badge-sm">Community Outreach Specialist</span>
					</td>
					<td>Indigo</td>
					<th>
						<button class="btn btn-ghost btn-xs">details</button>
					</th>
				</tr>
			</tbody>
			<!-- foot -->
			<!-- <tfoot>
				<tr>
					<th />
					<th>Name</th>
					<th>Job</th>
					<th>Favorite Color</th>
					<th />
				</tr>
			</tfoot> -->
		</table>
	</div>
</div>

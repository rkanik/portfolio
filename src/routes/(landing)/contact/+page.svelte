<script lang="ts">
	import TextArea from '$lib/components/base/TextArea.svelte'
	import TextField from '$lib/components/base/TextField.svelte'
	import { validator } from '@felte/validator-zod'
	import { createForm } from 'felte'
	import { z } from 'zod'
	import rocketImage from '$lib/assets/img/rocket-small.webp'

	const schema = z.object({
		name: z.string().min(1, 'Required.'),
		email: z.string().min(1, 'Required.').email(),
		company: z.string().nullable().optional(),
		message: z.string().min(1, 'Required.').max(500)
	})

	type Schema = z.infer<typeof schema>

	const { form, errors } = createForm<Schema>({
		extend: validator({ schema }),
		initialValues: {
			name: '',
			email: '',
			company: null,
			message: ''
		}
	})
</script>

<div class="container mx-auto pt-64 min-h-screen">
	<div class="relative">
		<div
			class="rounded-xl bg-base-100 border border-white border-opacity-10 p-4 md:p-12 lg:p-16 xl:p-20"
		>
			<div class="flex items-center w-full justify-between">
				<div class="max-w-xl">
					<div class="text-sm font-medium tracking-widest uppercase text-secondary">Contact me</div>
					<h2 class="text-5xl font-bold mt-4">Let's talk</h2>
					<div class="text-lg mt-4">
						Interested in working together? We should queue up a time to chat. <br /> I’ll buy the coffee.
					</div>
				</div>
				<img
					alt="Rocket"
					width="300"
					height="300"
					src={rocketImage}
					class="object-cover object-center rounded-xl"
				/>
			</div>
		</div>
		<form
			use:form
			class="bg-base-100 bg-opacity-70 backdrop-blur-3xl border border-white border-opacity-10 rounded-xl p-5 xl:p-16 max-w-lg space-y-4 absolute right-16 w-full shadow-2xl -top-32"
		>
			<TextField required name="name" label="Full Name" errors={$errors.name || []} />

			<TextField
				required
				name="email"
				type="email"
				label="Email Address"
				errors={$errors.email || []}
			/>
			<TextField name="company" label="Company" />

			<TextArea required name="message" label="Message" errors={$errors.message || []} />

			<div>
				<button type="submit" class="w-full rounded-lg btn btn-secondary mt-4">Submit</button>
			</div>
		</form>
	</div>
</div>

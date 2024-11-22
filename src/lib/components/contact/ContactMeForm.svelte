<script lang="ts">
	import type { TEnquiry } from '$lib/types.js'

	import Icon from '@iconify/svelte'
	import TextArea from '$lib/components/base/TextArea.svelte'
	import TextField from '$lib/components/base/TextField.svelte'

	import { z } from 'zod'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import { useContextStoreContext } from '$lib/store/useContextStore'

	const schema = z.object({
		name: z.string().min(1, 'Required.'),
		email: z.string().min(1, 'Required.').email(),
		company: z.string().nullable().optional(),
		message: z.string().min(1, 'Required.').max(500)
	})

	type Schema = z.infer<typeof schema>

	let error: any
	let inquiry: TEnquiry | null
	let loading = false

	const context = useContextStoreContext()
	const { publicUser, supabase } = $context

	const { form, errors } = createForm<Schema>({
		extend: validator({ schema }),
		initialValues: {
			name: '',
			email: '',
			company: null,
			message: ''
		},
		async onSubmit(values) {
			loading = true
			const response = await supabase
				.from('inquiries')
				.insert([
					{
						userId: publicUser.id,
						name: values.name,
						email: values.email,
						company: values.company,
						message: values.message
					}
				])
				.select('*')
				.single()

			loading = false

			console.log(response);
			if (response.error) {
				error = response.error
				return
			}

			inquiry = response.data
			console.log(response.data)
		}
	})
</script>

<form
	use:form
	class="w-full lg:max-w-md xl:max-w-lg p-5 border border-white shadow-2xl bg-primary bg-opacity-10 backdrop-blur-3xl border-opacity-10 rounded-xl xl:p-16 right-16 -top-32 min-h-[740px] flex flex-col {$$props.class}"
>
	{#if inquiry}
		<div class="flex flex-col items-center justify-center flex-1">
			<div class="h-32">
				<Icon class="text-9xl" icon="twemoji:party-popper" />
			</div>
			<h6 class="mt-12 text-4xl font-bold">You did it!</h6>
			<div class="mt-8 text-lg text-center">
				Thank you for your inquiry! I appreciate your interest in my services and will respond to
				your message as soon as possible. In the meantime, please feel free to browse the website or
				check your email for further updates.
			</div>
		</div>
	{:else}
		<div class="flex-1">
			<div class="text-sm font-medium tracking-widest uppercase text-secondary">Contact me</div>
			<h1 class="mt-2 text-4xl font-bold">Contact Form</h1>

			<div class="mt-8 space-y-2">
				{#if error}
					<div class="shadow-lg alert alert-error">
						<div>
							<Icon class="text-xl" icon="material-symbols:error-outline-rounded" />
							<span>{error.message}</span>
						</div>
						<div class="flex-none">
							<button class="btn btn-sm btn-circle" on:click={() => (error = null)}>
								<Icon class="text-lg" icon="mdi:close" />
							</button>
						</div>
					</div>
				{/if}

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
			</div>

			<div class="mt-12">
				<button type="submit" class="w-full rounded-lg btn btn-secondary" class:loading>
					Submit
				</button>
			</div>
		</div>
	{/if}
</form>

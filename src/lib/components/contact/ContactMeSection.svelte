<script lang="ts">
	import ContactMeForm from './ContactMeForm.svelte'
	import rocketImage from '$lib/assets/img/rocket-small.webp'
</script>

<div class="container min-h-screen mx-auto {$$props.class}">
	<div class="relative">
		<div
			class="p-4 border border-white rounded-xl bg-base-100 border-opacity-10 md:p-12 lg:p-16 xl:p-20"
		>
			<div class="flex items-center justify-between w-full">
				<div class="max-w-xl">
					<div class="text-sm font-medium tracking-widest uppercase text-secondary">Contact me</div>
					<h2 class="mt-4 text-5xl font-bold">Get in Touch</h2>
					<div class="mt-4 text-lg">
						If you have a project or an idea that you'd like to discuss, or if you simply want to
						say hello, feel free to get in touch with me using the form below. I'd love to hear from
						you and see how we can work together to bring your vision to life.
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
		<ContactMeForm />
	</div>
</div>

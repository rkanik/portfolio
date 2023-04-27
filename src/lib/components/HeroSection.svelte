<script>
	import { onMount } from 'svelte'
	import { darkColors } from '$lib/const'

	import random from '$lib/utils/random'
	import OrganicShape from './OrganicShape.svelte'
	import Icon from '@iconify/svelte'

	const colors = darkColors

	let color = ''
	let bgColor = ''

	const changeColor = () => {
		color = colors[random(colors.length)]
	}

	$: if (color) {
		bgColor = `background-color:${color};`
	}

	onMount(() => {
		changeColor()
		setInterval(changeColor, 10000)
	})
</script>

<div class="relative overflow-hidden landing-hero" style={bgColor}>
	<div class="container px-4 mx-auto sm:px-0">
		<div class="flex items-center h-screen px-16">
			<div class="relative flex items-center justify-between w-full">
				<div class="relative">
					<div class="relative z-20 blend-dodge">
						<h1 class="font-bold text-gray-100 text-7xl">
							<span class="mb-2 text-lg font-light text-white">Hi there, I am RK Anik</span><br />
							Full Stack
							<span class="text-gradient js">JavaScript</span><br />
							Developer
						</h1>
						<p class="max-w-xl mt-8 text-xl font-normal leading-normal text-gray-400">
							I am a full stack Javascript engineer based in Dhaka, Bangladesh. With over 3 years of
							experience in the field, I am passionate about creating innovative and user-friendly
							applications using cutting-edge technologies. I believe in delivering top-notch
							solutions that not only meet but exceed my clients' expectations.
						</p>
						<div class="relative z-20 flex mt-8 space-x-2">
							<a
								target="_blank"
								rel="noreferrer"
								class="btn btn-square btn-outline"
								href="https://github.com/rkanik"
							>
								<Icon icon="mdi:github" class="text-4xl" />
							</a>
							<a
								target="_blank"
								rel="noreferrer"
								class="btn btn-square btn-outline"
								href="https://www.linkedin.com/in/rkanik"
							>
								<Icon icon="mdi:linkedin" class="text-4xl" />
							</a>
							<a
								target="_blank"
								rel="noreferrer"
								class="btn btn-square btn-outline"
								href="https://www.facebook.com/rkanik.me"
							>
								<Icon icon="mdi:facebook" class="text-4xl" />
							</a>
							<a
								target="_blank"
								rel="noreferrer"
								class="btn btn-square btn-outline"
								href="https://www.instagram.com/rkanik.me"
							>
								<Icon icon="mdi:instagram" class="text-4xl" />
							</a>
							<a
								target="_blank"
								rel="noreferrer"
								class="btn btn-square btn-outline"
								href="https://wa.me/+8801703577953"
							>
								<Icon icon="mdi:whatsapp" class="text-4xl" />
							</a>
							<a
								target="_blank"
								rel="noreferrer"
								class="btn btn-square btn-outline"
								href="mailto:rkanik.me@gmail.com"
							>
								<Icon icon="mdi:gmail" class="text-4xl" />
							</a>
							<!-- <Button animate md="chevron_right" href="https://www.fiverr.com/rkanik">
								Hire Me
							</Button>
							<Button
								outlined
								download
								md="download"
								href="https://firebasestorage.googleapis.com/v0/b/rkanik-me.appspot.com/o/docs%2FCV%20of%20Md.%20Rasel%20Khandkar%20%5BCF%5D.pdf?alt=media&token=60010cca-a80b-405e-a29e-1707c80b8063"
							>
								Download CV
							</Button> -->
						</div>
					</div>
					<OrganicShape class="absolute z-10 -top-28 -left-48" />
				</div>
				<div class="relative max-w-4xl">
					<svg
						width="72"
						height="64"
						viewBox="0 0 72 64"
						class="absolute top-0 right-0 text-yellow-300 opacity-50 c-i-a-h-c h-96 w-96 text"
					>
						<g>
							<rect rx="32" fill="none" width="64" height="64" />
							<rect rx="8" width="16" height="16" fill="current-color" />
						</g>
					</svg>
					<img
						alt="RK Anik"
						class="relative z-10 object-cover object-top max-w-xl transform translate-y-32"
						src="/img/hero-me-trans.png"
					/>
					<div
						class="absolute z-0 w-full h-full max-w-[28rem] max-h-[28rem] transform -translate-x-1/2 bg-white bg-opacity-50 rounded-full left-1/2 top-24 glass-2"
					/>
				</div>
			</div>
		</div>
	</div>
	<img
		class="absolute bottom-0 left-0 z-0"
		src="/img/triangles.png"
		alt="background triangle shape"
	/>
</div>

<style lang="scss">
	.landing-hero {
		transition: background-color 10s ease;
		font-family: 'Inter', sans-serif;
	}
	.text-gradient {
		background-color: red;
		background-image: linear-gradient(
			to right,
			rgb(18, 194, 233),
			rgb(196, 113, 237),
			rgb(246, 79, 89)
		);
		background-size: 100%;
		background-repeat: no-repeat;
		-webkit-text-fill-color: transparent;
		-moz-text-fill-color: transparent;
		-moz-background-clip: text;
		-webkit-background-clip: text;
	}
</style>

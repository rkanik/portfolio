<script>
	import { onMount } from 'svelte'
	import { darkColors } from '$lib/const'

	import random from '$lib/utils/random'
	import OrganicShape from './OrganicShape.svelte'
	import Icon from '@iconify/svelte'
	import '$lib/assets/css/rainbow.css'
	import SocialLinks from './SocialLinks.svelte'

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
		<div class="flex items-center h-screen md:px-4">
			<div class="relative flex items-center justify-between w-full">
				<div class="relative">
					<div class="relative z-20 blend-dodge">
						<h1 class="font-bold text-gray-100 text-3xl md:text-7xl">
							<span class="mb-2 text-lg font-light text-white">Hi there, I am RK Anik</span><br />
							Full Stack
							<span class="text-gradient js">JavaScript</span><br />
							Developer
						</h1>
						<p class="max-w-xl mt-8 text-base md:text-xl font-normal leading-normal text-gray-400">
							I am a full stack Javascript engineer based in Dhaka, Bangladesh. With over 3 years of
							experience in the field, I am passionate about creating innovative and user-friendly
							applications using cutting-edge technologies. I believe in delivering top-notch
							solutions that not only meet but exceed my clients' expectations.
						</p>
						<SocialLinks class="relative z-20 mt-8" />
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
					<OrganicShape class="absolute z-10 -top-28 -left-48" />
				</div>
				<div class="relative min-h-[400px] max-w-[32px] md:max-w-4xl">
					<img
						alt="RK Anik"
						src="/img/hero-me-trans.png"
						class="relative z-10 object-cover object-top max-w-xl transform translate-y-32 hidden md:block"
					/>
					<div
						style="background-image: var(--hero-gradient-background-image)"
						class="absolute z-0 w-full h-full max-w-[28rem] max-h-[28rem] transform -translate-x-1/2 rounded-full left-1/2 top-24 blur-[120px] transition-all duration-1000"
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

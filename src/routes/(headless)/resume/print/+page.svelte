<script lang="ts">
	import { onMount } from 'svelte'

	onMount(() => {
		document.documentElement.setAttribute('data-theme', 'light')
	})
</script>

<svelte:head>
	<title>Resume of MD. RASEL KHANDKAR</title>
</svelte:head>

<div class="py-5">
	<div class="resume min-h-screen w-[816px] bg-white text-black mx-auto p-5 shadow-2xl">
		<div class="flex">
			<div class="flex-1">
				<h1><b>MD. RASEL KHANDKAR</b></h1>
				<p>218/ka, Begum Rokeya Sharani, West Kafrul, Dhaka 1207</p>
				<div>
					<b>Email:</b> <a href="mailto:rkanik.me@gmail.com">rkanik.me@gmail.com</a>
				</div>
				<div>
					<b>Contact:</b> <a href="tel:+8801568015679">+8801568015679</a>,
					<a href="tel:+8801703577953">+8801703577953</a>
				</div>
			</div>
			<div>
				<img
					src="https://i.ibb.co/99xZsm0/IMG-0613-01.jpg"
					alt="MD. RASEL KHANDKAR"
					class="w-[128px] h-[calc(128px/calc(25/30))] object-cover object-top"
				/>
			</div>
		</div>

		<div>
			<h2>Personal Profile</h2>
			<p class="text-justify">
				I look forward to my work and try to follow my work properly. I also try to learn from the
				mistakes of my work and try to improve in the work. Able to work well under pressure,
				prioritize workload and work to deadlines. Having a high level of intellectual curiosity.
				Highly motivated with a positive attitude. I am a lifelong and quick learner. I unpack
				complicated problems by approaching each with the flexibility and attention it deserves.
				Patience is my strength. Whenever I failed, I never stopped until I did it.
			</p>
		</div>

		<div class="mt-[768px]">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, earum temporibus ea dicta
			soluta id recusandae? Necessitatibus ut minus ea. Tenetur quaerat veniam rerum officiis, hic
			autem iste laudantium animi.
		</div>

		<div class="mt-[768px]">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, quia amet aliquam debitis
			illum excepturi eum ratione quidem quam animi totam. Omnis ipsum expedita sit. Architecto
			ducimus possimus repellendus atque.
		</div>
	</div>
</div>

<style lang="scss">
	.resume {
		font-size: 18px;
		font-family: 'Times New Roman', Times, serif;

		h1,
		h2 {
			font-weight: bold;
		}

		h1 {
			font-size: 24px;
		}

		h2 {
			font-size: 20px;
		}

		a {
			color: blue;
			text-decoration: underline;
		}
	}
</style>

<script>
	import SocialLinks from './SocialLinks.svelte'
</script>

<div class="grid w-full grid-cols-12 gap-4 overflow-hidden md:gap-16">
	<div class="col-span-12 md:col-span-4">
		<img
			src="/img/me2.webp"
			alt="Md Rasel Khandkar"
			class="object-cover object-bottom w-full rounded-lg"
		/>
	</div>
	<div class="col-span-12 md:col-span-8">
		<div class="text-sm font-medium tracking-widest uppercase text-secondary">About me</div>
		<h1 class="mt-4 mb-8 text-5xl font-bold">Who Am I</h1>
		<div class="mt-4 text-base">
			<p>
				Hi there! My name is MD Rasel Khandkar and I am a professional full stack Javascript
				engineer. I completed my Bachelor's degree in Computer Science and Engineering from Daffodil
				International University. Since then, I have been working in the field of web development,
				specializing in front-end and back-end technologies. I am committed to delivering
				high-quality solutions that are tailored to my clients' needs and requirements. In my free
				time, I enjoy learning new technologies and expanding my knowledge base.
			</p>
			<br />
			<p>
				I have been working in the tech industry, honing my skills and knowledge. My expertise lies
				in developing scalable and maintainable web applications using modern technologies such as
				React, Node.js, and MongoDB. I am committed to delivering high-quality solutions that meet
				my clients' needs and exceed their expectations. Outside of work, I enjoy reading and
				spending time with my family and friends.
			</p>
			<br />
			<p>
				I am deeply passionate about programming and love to challenge myself to create innovative
				and efficient solutions to real-world problems. In my free time, you can usually find me
				exploring new technologies, collaborating with like-minded individuals, or contributing to
				open-source projects. I believe in the power of technology to transform lives and look
				forward to making a positive impact in the world through my work.
			</p>

			<br />
			<p>Let's turn your ideas into reality with my expertise!</p>

			<div class="flex items-center mt-8 space-x-4">
				<a href="/contact" class="text-base tracking-wide normal-case rounded-full btn btn-primary"
					>Contact me</a
				>
				<SocialLinks class="" btnClass="btn-circle btn-sm" iconClass="text-2xl" />
			</div>
		</div>
	</div>
</div>

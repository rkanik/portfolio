<script lang="ts">
	import TimelineItem from './TimelineItem.svelte'

	const items = [
		{
			year: 2021,
			title: 'Associate Software Engineer',
			lines: [
				'<a href="https://encoderit.net/" target="blank" class="font-medium text-secondary hover:underline">Encoder IT</a>, Middle Badda, Dhaka.',
				'March 2021 to Present.'
			]
		},
		{
			year: 2020,
			title: 'Associate Frontend Engineer',
			lines: [
				'<a href="https://xpeedstudio.com/" target="blank" class="font-medium text-secondary hover:underline">Xpeed Studio</a>, Asad Ave, Dhaka.',
				'15 June 2020 – 30 Nov 2020.'
			]
		},
		{
			year: 2020,
			title: 'Front End Developer [Internship]',
			lines: [
				'<a href="https://www.facebook.com/cystemarts/" target="blank" class="font-medium text-secondary hover:underline">Cystem Arts</a>, Mohammadpur, Dhaka.',
				'11 Jan 2020 - 20 Apr 2020.'
			]
		},
		{
			year: 2020,
			title: 'B.Sc. in Computer Science and Engineering (CSE)',
			lines: [
				'<a href="https://www.facebook.com/cystemarts/" target="blank" class="font-medium text-secondary hover:underline">Daffodil International University</a>',
				'2016 – 2020 | CGPA 3.22 out of 4.00.'
			]
		},
		{
			year: 2015,
			title: 'Higher Secondary Certificate (HSC)',
			lines: [
				'Sarishabari College, Sarishabari, Jamalpur.',
				'Group: Science, GPA: 4.17 out of 5.00, Board: Dhaka.'
			]
		},
		{
			year: 2013,
			title: 'Secondary School Certificate (SSC)',
			lines: [
				'Sarishabari Reaz Uddin Talukder High School, Sarishabari, Jamalpur.',
				'Group: Science, GPA: 5.00 out of 5.00, Board: Dhaka.'
			]
		}
	]
</script>

<div class="w-full max-w-6xl">
	{#each items as item, index}
		<TimelineItem {item} right={index % 2 === 0} />
	{/each}
</div>

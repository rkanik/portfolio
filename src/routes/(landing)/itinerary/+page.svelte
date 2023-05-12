<script lang="ts">
	import { PUBLIC_OPEN_AI_API_KEY } from '$env/static/public'
	import { onMount } from 'svelte'

	const generateItinerary = async () => {
		try {
			const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${PUBLIC_OPEN_AI_API_KEY || ''}`
				},
				body: JSON.stringify({
					prompt: "Generate a 2-day itinerary for Cox's Bazar using GPT-3.5 model.",
					max_tokens: 100,
					temperature: 0.5
				})
			})

			const data = await response.json()
			const itineraryResponse = data.choices[0].text

			const placeEntries = itineraryResponse.split(' - ')
			const formattedItinerary: any = []

			placeEntries.forEach((entry: any) => {
				const nameStartIndex = entry.indexOf('(')
				const nameEndIndex = entry.indexOf(')')
				const coordinatesStartIndex = entry.indexOf('(', nameEndIndex)
				const coordinatesEndIndex = entry.indexOf(')', coordinatesStartIndex)

				if (
					nameStartIndex !== -1 &&
					nameEndIndex !== -1 &&
					coordinatesStartIndex !== -1 &&
					coordinatesEndIndex !== -1
				) {
					const name = entry.substring(0, nameStartIndex).trim()
					const coordinates = entry.substring(nameStartIndex + 1, nameEndIndex)
					const description = entry.substring(coordinatesEndIndex + 1).trim()

					const latitudeMatch = coordinates.match(/(\d+\.\d+)° N/)
					const longitudeMatch = coordinates.match(/(\d+\.\d+)° E/)

					if (latitudeMatch && longitudeMatch) {
						const latitude = parseFloat(latitudeMatch[1])
						const longitude = parseFloat(longitudeMatch[1])

						formattedItinerary.push({ name, coordinates: { latitude, longitude }, description })
					}
				}
			})

			// setItinerary(formattedItinerary)

			console.log('formattedItinerary', formattedItinerary)
		} catch (error) {
			console.error('Error generating itinerary:', error)
		}
	}

	// onMount(() => {
	// 	generateItinerary()
	// })
</script>

<button on:click={generateItinerary}>Generate Itinerary</button>

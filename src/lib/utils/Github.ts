const baseUrl = 'https://api.github.com'

type Repository = {
	name: string
	description: string
	// Add more properties as needed
}

type Collaborator = {
	login: string
	// Add more properties as needed
}

type LanguageStats = {
	[language: string]: number
}

const fetchWithFallback = <T>(url: string, fallback: T) => {
	return new Promise<T>((resolve) => {
		fetch(url, {
			headers: new Headers({
				Authorization: `Bearer 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`
			})
		})
			.then((raw) => raw.json())
			.then((res) => resolve(res as T))
			.catch(() => resolve(fallback))
	})
}

async function getRepository(path: string): Promise<any> {
	const repositoryUrl = `${baseUrl}/repos/${path}`
	const contributorsUrl = `${baseUrl}/repos/${path}/contributors`
	const languagesUrl = `${baseUrl}/repos/${path}/languages`

	const [repository, contributors, languages] = await Promise.all([
		fetchWithFallback<Repository>(repositoryUrl, { name: '', description: '' }),
		fetchWithFallback<Collaborator[]>(contributorsUrl, []),
		fetchWithFallback<LanguageStats[]>(languagesUrl, [])
	])

	return {
		...repository,
		contributors,
		languages
	}
}

const Github = {
	getRepository
}

export default Github

import { env } from '$env/dynamic/public'

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

const fetchWithFallback = <T>(
	url: string,
	fallback: T,
	token = env.PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN
) => {
	return new Promise<T>((resolve) => {
		fetch(url, {
			headers: new Headers({
				Authorization: `Bearer ${token}`
			})
		})
			.then((raw) => raw.json())
			.then((res) => resolve(res as T))
			.catch(() => resolve(fallback))
	})
}

async function getRepository(path: string, token: string): Promise<any> {
	const repositoryUrl = `${baseUrl}/repos/${path}`
	const contributorsUrl = `${baseUrl}/repos/${path}/contributors`
	const languagesUrl = `${baseUrl}/repos/${path}/languages`

	const [repository, contributors, languages] = await Promise.all([
		fetchWithFallback<Repository>(repositoryUrl, { name: '', description: '' }, token),
		fetchWithFallback<Collaborator[]>(contributorsUrl, [], token),
		fetchWithFallback<LanguageStats[]>(languagesUrl, [], token)
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

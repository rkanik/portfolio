import type { Database } from '../../supabase'

export type TEducation = {
	year: number
	title: string
	right?: boolean
	lines: string[]
}

export type TExperience = {
	year: number
	title: string
	right?: boolean
	lines: string[]
}

export type TProfileGithub = {
	accessTokens: {
		name: string
		value: string
	}[]
}

export type TProfile = Database['public']['Tables']['profiles']['Row'] & {
	educations: TEducation[]
	experiences: TExperience[]
	github: TProfileGithub
}

import type { Readable, Writable } from 'svelte/store'
import type { Database } from '../supabase'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

export type BaseFormFieldOption = {
	[key: string]: any
}

export type Maybe<T> = T | null | undefined

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

export type BaseFormField = {
	name: string
	type: 'text' | 'number' | 'tel' | 'email' | 'file' | 'textarea' | 'combobox'
	label?: string
	class?: string
	placeholder?: string
	options?: BaseFormFieldOption[]
	prefix?: string
	suffix?: string
	combobox?: any
	multiple?: boolean
	accept?: string
}

export type TSupabase = SupabaseClient<Database, 'portfolio'>

export type TId = string | number

export type AnyFn = (...args: unknown[]) => void

export type AnyObject = { [key: string]: any }

export type TAttachment = Database['portfolio']['Tables']['attachments']['Row']
export type TProjectAttachment = Database['portfolio']['Tables']['project_attachments']['Row'] & {
	attachments: TAttachment
}

export type TTechnology = Database['portfolio']['Tables']['technologies']['Row']
export type TUserTechnology = Database['portfolio']['Tables']['user_technologies']['Row'] & {
	technologies: TTechnology
}
export type TProjectTechnology = Database['portfolio']['Tables']['project_technologies']['Row'] & {
	technologies: TTechnology
}

export type TGithubLanguages = {
	[language: string]: number
}

export type TGithubContributor = {
	login: string
	avatar_url: string
	html_url: string
}

export type TGithubRepository = {
	name: string
	full_name: string
	private: boolean
	owner: {
		login: string
		html_url: string
		avatar_url: string
	}
	html_url: string
	description: string | null
	homepage: string | null
	contributors: TGithubContributor[]
	languages: TGithubLanguages
}

export type TProject = Database['portfolio']['Tables']['projects']['Row'] & {
	repository: TGithubRepository | null
	projectAttachments: TProjectAttachment[]
	projectTechnologies: TProjectTechnology[]
}

export type TTestimonial = Database['portfolio']['Tables']['testimonials']['Row'] & {
	avatar: TAttachment | null
}

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

export type TUser = User

export type TProfile = Database['portfolio']['Tables']['profiles']['Row'] & {
	user?: User
	educations: TEducation[]
	experiences: TExperience[]
}

export type TPublicUser = {
	id: string
	profile: TProfile | null
}

export type TPublicContext = {
	user: User | null
	session: Session | null
	publicUser: TPublicUser
	supabase: SupabaseClient<Database, 'portfolio'>
}

export type TAuthContext = {
	user: User
	session: Session
	publicUser: TPublicUser
	supabase: SupabaseClient<Database, 'portfolio'>
}

export type TContext = TPublicContext | TAuthContext

export type TPagination = {
	page?: number
	perPage?: number
}

export type TEnquiry = Database['portfolio']['Tables']['inquiries']['Row']

export type ClickEvent<T> = MouseEvent & {
	currentTarget: EventTarget & T
}

export type Store<T> = Writable<T> | Readable<T>

export type MaybeGetter<T, A = undefined> = T | Store<T> | ((...args: A[]) => T)

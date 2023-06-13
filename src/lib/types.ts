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

export type TSupabase = SupabaseClient<Database>

export type TId = string | number

export type AnyFn = () => void

export type AnyObject = { [key: string]: any }

export type TAttachment = Database['public']['Tables']['attachments']['Row']
export type TProjectAttachment = Database['public']['Tables']['projectAttachments']['Row'] & {
	attachments: TAttachment
}

export type TTechnology = Database['public']['Tables']['technologies']['Row']
export type TUserTechnology = Database['public']['Tables']['userTechnologies']['Row'] & {
	technologies: TTechnology
}
export type TProjectTechnology = Database['public']['Tables']['projectTechnologies']['Row'] & {
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

export type TProject = Database['public']['Tables']['projects']['Row'] & {
	repository: TGithubRepository | null
	projectAttachments: TProjectAttachment[]
	projectTechnologies: TProjectTechnology[]
}

export type TTestimonial = Database['public']['Tables']['testimonials']['Row'] & {
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

export type TProfile = Database['public']['Tables']['profiles']['Row'] & {
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
	supabase: SupabaseClient<Database>
}

export type TAuthContext = {
	user: User
	session: Session
	publicUser: TPublicUser
	supabase: SupabaseClient<Database>
}

export type TContext = TPublicContext | TAuthContext

export type TPagination = {
	page?: number
	perPage?: number
}

export type TEnquiry = Database['public']['Tables']['inquiries']['Row']

export type ClickEvent<T> = MouseEvent & {
	currentTarget: EventTarget & T
}

export type Store<T> = Writable<T> | Readable<T>

export type MaybeGetter<T, A = undefined> = T | Store<T> | ((...args: A[]) => T)

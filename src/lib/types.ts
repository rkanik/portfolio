import type { Database } from '../supabase'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

export type BaseFormFieldOption = {
	[key: string]: any
}

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

export type TProject = Database['public']['Tables']['projects']['Row'] & {
	projectAttachments: TProjectAttachment[]
	projectTechnologies: TProjectTechnology[]
}

export type TTestimonial = Database['public']['Tables']['testimonials']['Row']
export type TUserTestimonial = Database['public']['Tables']['userTestimonials']['Row'] & {
	testimonials: TTestimonial
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

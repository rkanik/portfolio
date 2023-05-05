import type { Database } from '../supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

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

export type TProjectNew = Database['public']['Tables']['projects']['Insert']

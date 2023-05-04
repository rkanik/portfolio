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

export type TAttachments = Database['public']['Tables']['attachments']['Row']
export type TProjectAttachments = Database['public']['Tables']['projectAttachments']['Row'] & {
	attachments: TAttachments
}

export type Technology = Database['public']['Tables']['technologies']['Row']
export type TProjectTechnology = Database['public']['Tables']['projectTechnologies']['Row'] & {
	technologies: Technology
}

export type TProject = Database['public']['Tables']['projects']['Row'] & {
	projectAttachments: TProjectAttachments[]
	projectTechnologies: TProjectTechnology[]
}

export type TProjectNew = Database['public']['Tables']['projects']['Insert']

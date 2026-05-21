export interface Source {
    id: number | null
    name: string
}

export interface Age {
    id: number | null
    age_group: string
}

export interface Gender {
    id: number | null
    gender_group: string
}

export interface Region {
    id: number | null
    region_name: string
    region_short: string | null
    parent_id : number | null
    iso2: string | null
    iso3: string | null
    iso_num: number | null
}

export interface Datatype {
    id: number | null
    datatype_description: string
}

export interface Scenario {
    id: number | null
    scenario_description: string
}

export interface Report {
    id: number | null
    source_id: number 
    year_published: number
    title: string
}

export interface DatapointResponse {
    year_analyzed: number 
    value: number
    scenario: string
    region_name: string
    report_title: string
}
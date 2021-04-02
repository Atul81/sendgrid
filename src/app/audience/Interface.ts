export interface ContactsInterface {
    key: string,
    email: string,
    firstName: string,
    lastName: string,
    emailMarketing: string,
    tags: string
}

export interface AddSegment {
    key: string,
    segment: string
}

export interface CustomFields {
    key: string,
    fieldName: string,
    fieldType: string
}

export interface SegmentInterface{
    key: string,
    name: string,
    contacts: number,
    conditions: number
}
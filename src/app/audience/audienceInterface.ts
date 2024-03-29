export interface ContactsInterface {
    key: string,
    email: string,
    firstName: string,
    lastName: string,
    emailMarketing: string,
    tags: string,
    segments: string
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

export interface SegmentInterface {
    key: string,
    name: string,
    type: number,
    lastModified: number
}

export interface ImportsInterface {
    key: string,
    fileName: string,
    importTimestamp: string,
    rowsFraction: string,
    status: string
}

export interface ImportsDetailsInterface {
    key: string,
    email: string,
    firstName: string,
    lastName: string,
    city: string,
    postalCode: string,
    failureReason: string
}

export interface QuickAddContactInterface {
    key: string,
    email: string,
    firstName: string,
    lastName: string
}

export interface ExportContactInterface {
    key: string,
    fileName: string,
    exportTimestamp: string,
}

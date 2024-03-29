export interface DnsRecordsInterface {
    key: string,
    type: string,
    dnsName: string,
    canonicalName: string
}

export interface DedicatedIpsInterface {
    key: string,
    ipAddress: string,
    purchaseDate: string,
    status: string
}

export interface CustomEventsInterface {
    key: string,
    name: string,
    status: string,
    description: string
}

export interface UsersInterface {
    key: string,
    email: string,
    type: string,
    permission: string
}

export interface DomainModal {
    key: string,
    name: string,
    type: string,
    value: string
}

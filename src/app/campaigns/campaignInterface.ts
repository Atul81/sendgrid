export interface AutomationInterfaces {
    key: string,
    name: string,
    delivered: number,
    uniqueOpens: number,
    uniqueClicks: number
}

export interface CampaignsInterface {
    key: string,
    name: string,
    delivered: string,
    uniqueOpens: string,
    uniqueClicks: string,
    status: string
}

export interface SendersInterface {
    key: string,
    email: string,
    firstName: string,
    lastName: string,
    domainVerified: string,
}
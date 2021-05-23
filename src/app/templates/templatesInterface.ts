export interface TemplatesInterface {
    "id": number,
    "title": string,
    "authors": string,
    "average_rating": number,
    "isbn": number,
    "language_code": string,
    "ratings_count": number,
    "price": number
}

export interface DeliveryTestingInterface {
    "id": number,
    "testName": string,
    "dateTime": string,
    "status": string
}

export interface BookDetails
{
    bookId: number,
    title: string
    averageRating: number
    isbn: string
    language_code: string
    ratings_count: string
    price: string,
    imageUrl: string,
    authors: string
}

export interface CartDetails
{
    key: number,
    title: string
    averageRating: number
    price: number,
    remarks: string,
    author: string
}

export interface OrderDetails
{
    key: number,
    orderStatus: string,
    paymentStatus: string,
    booksOrdered: string[],
    orderedOn: string,
    price: number
}

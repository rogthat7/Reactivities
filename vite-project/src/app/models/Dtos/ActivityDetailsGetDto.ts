export interface ActivityDetailsGetDto {
    data : {
        id: string
        title: string
        date: Date
        description: string
        category: string
        city: string
        venue: string
        latitude: number
        longitude: number
    },
    error : string | null,
    isSuccess : boolean
    statusCode : number 
}
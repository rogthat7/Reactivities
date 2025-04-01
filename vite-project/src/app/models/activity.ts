import { LocationIQSuggestion } from "./Location"

export interface Activity {
    id: string
    title: string
    date: Date
    description: string
    category: string
    city: string
    venue: string
    latitude: number
    longitude: number
    location?: LocationIQSuggestion
  }
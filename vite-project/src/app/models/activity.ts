export interface Activity {
      id: string
      title: string
      date: Date | null
      description: string
      category: string
      city: string
      venue: string
      latitude: number | 0
      longitude: number
  }
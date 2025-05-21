export type Profile ={
    id: string 
    displayName: string
    username: string
    bio?: string | null | undefined
    imageUrl?: string
    isFollowing?: boolean
    followersCount?: number
    followingsCount?: number
} 
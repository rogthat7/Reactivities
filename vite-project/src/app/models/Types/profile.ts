export type Profile ={
    id: string
    displayName: string
    username: string
    bio?: string
    imageUrl?: string
    following: boolean
    followersCount: number
    followingCount: number
    isFollowing?: boolean
    isFollowedBy?: boolean
} 
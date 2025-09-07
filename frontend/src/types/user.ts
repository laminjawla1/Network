export type User = {
    id: number
    first_name: string
    last_name: string
    username: string
    image: string
    followers: Array<number>
}

export type UserInstance = {
    currentUser: User | null
}

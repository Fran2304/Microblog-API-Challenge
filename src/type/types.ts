export type commentType = {
    content: string
    published?: boolean
}

export type postType = {
    title: string
    content: string
    published?: boolean
}

export type userType = {
    email: string
    nickname: string
    firstName: string
    lastName: string
    password: string
    bio?: string
    hashActivation: string
    visibleEmail: boolean
    visibleName: boolean
}

export type likeJson = {
    like: boolean
}

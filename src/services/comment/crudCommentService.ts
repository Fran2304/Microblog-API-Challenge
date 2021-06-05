import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// eslint-disable-next-line no-unused-vars
export const getAllComments = async (authorId: string) => {
    const authId: number = Number.parseInt(authorId)
    const comments = await prisma.comment.findMany({
        where: {
            authorId: authId,
        },
    })
    return comments
}

export const createService = async (authorId: number) => {
    await prisma.comment.create({
        data: {
            createdAt: '',
            content: '',
            likesQuantity: 0,
            authorId: authorId,
            postId: 1,
        },
    })
    return 'hola'
}

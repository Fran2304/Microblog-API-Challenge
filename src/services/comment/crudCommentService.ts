import { PrismaClient } from '@prisma/client'
import { Icomment } from '../../interfaces/comment.interface'
import { ErrorHandler } from '../../interfaces/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const getAllComments = async (authorId: string) => {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                authorId: fixId(authorId),
                published: true,
            },
        })
        return { result: comments, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant get comments', 404, e.message)
    }
}

export const createComment = async (params: Icomment) => {
    try {
        await prisma.comment.create({
            data: {
                ...params,
                likesQuantity: 0,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant create comment', 404, e.message)
    }
}

export const updateComment = async (id: string, content: string) => {
    try {
        await prisma.comment.update({
            where: {
                id: fixId(id),
            },
            data: {
                content: content,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant update comment', 404, e.message)
    }
}

export const deleteComment = async (id: string) => {
    try {
        const commentToDelete = await prisma.comment.findFirst({
            where: {
                id: fixId(id),
            },
        })
        await prisma.comment.delete({
            where: {
                id: fixId(id),
            },
        })
        return { result: commentToDelete, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant delete comment', 404, e.message)
    }
}

export const readComment = async (id: string) => {
    try {
        const comment = await prisma.comment.findFirst({
            where: {
                id: fixId(id),
            },
        })
        return { result: comment, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant read comment', 404, e.message)
    }
}

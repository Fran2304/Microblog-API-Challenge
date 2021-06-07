import { PrismaClient } from '@prisma/client'
import { Icomment } from '../../interfaces/comment.interface'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const createComment = async (authorId: string, params: Icomment) => {
    try {
        const today: Date = new Date()
        await prisma.comment.create({
            data: {
                ...params,
                createdAt: today,
                published: params.published != null ? params.published : true,
                likesQuantity: 0,
                authorId: fixId(authorId),
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant create comment', 404, e.message)
    }
}

export const updateComment = async (
    id: string,
    commentId: string,
    params: Icomment
) => {
    try {
        let commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
            },
        })
        if (commentToUpdate == null) {
            return {
                result: 'cant update a comment that does not exist ',
                status: 404,
            }
        }
        commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                authorId: fixId(id),
            },
        })
        if (commentToUpdate == null) {
            return {
                result: 'cant update comment because does not belongs to user',
                status: 404,
            }
        }
        await prisma.comment.update({
            where: {
                id: fixId(commentId),
            },
            data: {
                ...params,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant update comment', 404, e.message)
    }
}

export const deleteComment = async (id: string, commentId: string) => {
    try {
        let commentToDelete = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
            },
        })
        if (commentToDelete == null) {
            return {
                result: 'cant delete a comment that does not exist',
                status: 404,
            }
        }
        commentToDelete = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                authorId: fixId(id),
            },
        })
        if (commentToDelete == null) {
            return {
                result: 'cant delete a comment that does not belongs to user',
                status: 404,
            }
        }
        await prisma.comment.delete({
            where: {
                id: fixId(commentId),
            },
        })
        return { result: commentToDelete, status: 200 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant delete comment', 404, e.message)
    }
}

export const readPublishedComments = async () => {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                published: true,
            },
        })
        if (comments.length == 0) {
            return { result: null, status: 404 }
        }
        return { result: comments, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant get comments', 404, e.message)
    }
}

export const readComment = async (id: string) => {
    try {
        const comment = await prisma.comment.findFirst({
            where: {
                id: fixId(id),
            },
        })
        if (comment == null) {
            return {
                result: 'comment that does not exist',
                status: 404,
            }
        }
        return { result: comment, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant read comment', 404, e.message)
    }
}

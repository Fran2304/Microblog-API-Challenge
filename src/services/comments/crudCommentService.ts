import { PrismaClient } from '@prisma/client'
import { commentType, likeJson, resultLike } from '../../type/types'
import { plainToClass } from 'class-transformer'
import { CommentDto } from '../../Dtos/commentDto'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const createComment = async (
    authorId: number,
    postId: string,
    params: commentType
) => {
    try {
        const pId = fixId(postId)

        if (!params.content) {
            throw new ErrorHandler(
                'ERROR: Content cant be empty',
                411,
                'ERROR: Content cant be empty'
            )
        }
        const post = await prisma.post.findFirst({
            where: {
                id: pId,
            },
        })
        if (post == null) {
            throw new Error('ERROR: the post that does not exist')
        }
        const today: Date = new Date()
        const commentCreated = await prisma.comment.create({
            data: {
                ...params,
                createdAt: today,
                published: params.published != null ? params.published : true,
                likesQuantity: 0,
                authorId: authorId,
                postId: pId,
            },
        })
        return { result: plainToClass(CommentDto, commentCreated), status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, e.status ?? 404, e)
    }
}

export const updateComment = async (
    authorId: number,
    postId: string,
    commentId: string,
    params: commentType
) => {
    try {
        const cId = fixId(commentId)
        const pId = fixId(postId)

        let commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: cId,
            },
        })
        if (commentToUpdate == null) {
            throw new Error('ERROR: cant update a comment that does not exist ')
        }
        commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: cId,
                postId: pId,
            },
        })
        if (commentToUpdate == null) {
            throw new Error(
                'ERROR: cant update comment because its not related to post'
            )
        }

        commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: cId,
                postId: pId,
                authorId: authorId,
            },
        })
        if (commentToUpdate == null) {
            throw new Error(
                'ERROR: cant update comment that does not belongs to user'
            )
        }
        let commentUpdated = await prisma.comment.update({
            where: {
                id: cId,
            },
            data: {
                ...params,
            },
        })
        return { result: plainToClass(CommentDto, commentUpdated), status: 200 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const deleteComment = async (
    authorid: number,
    postId: string,
    commentId: string
) => {
    try {
        const cId = fixId(commentId)
        const pId = fixId(postId)

        let commentToDelete = await prisma.comment.findFirst({
            where: {
                id: cId,
            },
        })
        if (commentToDelete == null) {
            throw new Error('ERROR: cant delete a comment that does not exist')
        }
        commentToDelete = await prisma.comment.findFirst({
            where: {
                id: cId,
                postId: pId,
            },
        })
        if (commentToDelete == null) {
            throw new Error(
                'ERROR: cant delete comment because its not related to post'
            )
        }
        commentToDelete = await prisma.comment.findFirst({
            where: {
                id: cId,
                postId: pId,
                authorId: authorid,
            },
        })
        if (commentToDelete == null) {
            throw new Error(
                'ERROR: cant delete a comment that does not belongs to user'
            )
        }
        await prisma.comment.delete({
            where: {
                id: cId,
            },
        })
        return { result: commentToDelete, status: 200 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const readPublishedComments = async (postId: string) => {
    try {
        const pId = fixId(postId)

        let post = await prisma.post.findFirst({
            where: {
                id: pId,
            },
        })
        if (post == null) {
            throw new Error('ERROR: post does not exist')
        }
        const comments = await prisma.comment.findMany({
            where: {
                published: true,
                postId: pId,
            },
        })
        if (comments.length == 0) {
            return { result: null, status: 404 }
        }
        return { result: comments, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const readComment = async (postId: string, commentId: string) => {
    try {
        const cId = fixId(commentId)
        const pId = fixId(postId)

        let comment = await prisma.comment.findFirst({
            where: {
                id: cId,
            },
        })
        if (comment == null) {
            throw new Error('ERROR: comment does not exist')
        }
        comment = await prisma.comment.findFirst({
            where: {
                id: cId,
                postId: pId,
            },
        })
        if (comment == null) {
            throw new Error('ERROR: comment is not related to post')
        }
        return { result: comment, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const ProcessCommentLike = async (
    authorId: number,
    postId: string,
    commentId: string,
    likeData: likeJson
) => {
    try {
        const cId = fixId(commentId)
        const pId = fixId(postId)
        let comment = await prisma.comment.findFirst({
            where: {
                id: cId,
            },
        })
        if (comment == null) {
            throw new Error('ERROR: the comment does not exist ')
        }
        const commentToLike = await prisma.comment.findFirst({
            where: {
                id: cId,
                postId: pId,
            },
        })
        if (commentToLike == null) {
            throw new Error('ERROR: the comment is not related to post')
        }
        let rLike: resultLike = { total: 0 }
        if (likeData.like) {
            rLike = await likeComment(authorId, cId, comment.likesQuantity)
        } else {
            if (comment.likesQuantity != 0) {
                rLike = await dislikeComment(
                    authorId,
                    fixId(commentId),
                    comment.likesQuantity
                )
            }
        }
        return { result: rLike.total, status: 200 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler(e.message, 404, e)
    }
}

const likeComment = async (
    authorId: number,
    commentId: number,
    quantity: number
) => {
    try {
        const commentLike = await prisma.commentLikes.findFirst({
            where: {
                commentId: commentId,
                authorId: authorId,
            },
        })
        if (commentLike !== null) {
            throw new Error('ERROR: cant like a comment that has a like')
        }

        const addLikes = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                likesQuantity: quantity + 1,
            },
        })
        await prisma.commentLikes.create({
            data: {
                commentId: commentId,
                authorId: authorId,
                like: true,
            },
        })
        return { total: addLikes.likesQuantity }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler(e.message, 404, e)
    }
}

const dislikeComment = async (
    authorId: number,
    commentId: number,
    quantity: number
) => {
    try {
        const commentLike = await prisma.commentLikes.findFirst({
            where: {
                commentId: commentId,
                authorId: authorId,
            },
        })
        if (commentLike == null) {
            throw new Error(
                'ERROR: cant dislike a comment that was not previously liked for user'
            )
        }
        const removeLikes = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                likesQuantity: quantity - 1,
            },
        })
        await prisma.commentLikes.delete({
            where: {
                id: commentLike?.id,
            },
        })

        return { total: removeLikes.likesQuantity }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler(e.message, 404, e)
    }
}

import { PrismaClient } from '@prisma/client'
import { commentType, likeJson } from '../../type/types'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const createComment = async (
    authorId: string,
    postId: string,
    params: commentType
) => {
    try {
        if (!params.content) {
            throw new ErrorHandler('Content cant be empty', 411, '')
        }
        const post = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
            },
        })
        if (post == null) {
            throw new Error('ERROR: the post that does not exist')
        }
        const today: Date = new Date()
        await prisma.comment.create({
            data: {
                ...params,
                createdAt: today,
                published: params.published != null ? params.published : true,
                likesQuantity: 0,
                authorId: fixId(authorId),
                postId: fixId(postId),
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler(e.message, e.status ?? 404, e)
    }
}

export const updateComment = async (
    id: string,
    postId: string,
    commentId: string,
    params: commentType
) => {
    try {
        let commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
            },
        })
        if (commentToUpdate == null) {
            throw new Error('cant update a comment that does not exist ')
        }
        commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
            },
        })
        if (commentToUpdate == null) {
            throw new Error(
                'cant update comment because its not related to post'
            )
        }

        commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
                authorId: fixId(id),
            },
        })
        if (commentToUpdate == null) {
            throw new Error('cant update comment that does not belongs to user')
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
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const deleteComment = async (
    id: string,
    postId: string,
    commentId: string
) => {
    try {
        let commentToDelete = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
            },
        })
        if (commentToDelete == null) {
            throw new Error('cant delete a comment that does not exist')
        }
        commentToDelete = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
            },
        })
        if (commentToDelete == null) {
            throw new Error(
                'cant delete comment because its not related to post'
            )
        }
        commentToDelete = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
                authorId: fixId(id),
            },
        })
        if (commentToDelete == null) {
            throw new Error(
                'cant delete a comment that does not belongs to user'
            )
        }
        await prisma.comment.delete({
            where: {
                id: fixId(commentId),
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
        const comments = await prisma.comment.findMany({
            where: {
                published: true,
                postId: fixId(postId),
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
        let comment = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
            },
        })
        if (comment == null) {
            throw new Error('comment that does not exist')
        }
        comment = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
            },
        })
        if (comment == null) {
            throw new Error('comment is not related to post')
        }
        return { result: comment, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const ProcessCommentLike = async (
    authorId: string,
    commentId: string,
    likeData: likeJson
) => {
    try {
        let comment = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
            },
        })
        if (comment == null) {
            throw new Error('cant like a comment that does not exist ')
        }
        if (likeData.like) {
            likeComment(
                fixId(authorId),
                fixId(commentId),
                comment.likesQuantity
            )
        } else {
            if (comment.likesQuantity != 0) {
                dislikeComment(
                    fixId(authorId),
                    fixId(commentId),
                    comment.likesQuantity
                )
            }
        }

        return { result: null, status: 204 }
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

        if (commentLike == null) {
            await prisma.comment.update({
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
        }
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
                'cant dislike a comment that was not previously liked for user'
            )
        }
        await prisma.comment.update({
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
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler(e.message, 404, e)
    }
}

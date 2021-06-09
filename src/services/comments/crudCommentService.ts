import { PrismaClient } from '@prisma/client'
import { Icomment } from '../../interfaces/comment.interface'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const createComment = async (
    authorId: string,
    postId: string,
    params: Icomment
) => {
    try {
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
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant create comment', 404, e.message)
    }
}

export const updateComment = async (
    id: string,
    postId: string,
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
                postId: fixId(postId),
            },
        })
        if (commentToUpdate == null) {
            return {
                result: 'cant update comment because its not related to post',
                status: 404,
            }
        }
        commentToUpdate = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
                authorId: fixId(id),
            },
        })
        if (commentToUpdate == null) {
            return {
                result: 'cant update comment that does not belongs to user',
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
            return {
                result: 'cant delete a comment that does not exist',
                status: 404,
            }
        }
        commentToDelete = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
            },
        })
        if (commentToDelete == null) {
            return {
                result: 'cant delete comment because its not related to post',
                status: 404,
            }
        }
        commentToDelete = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
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
        throw new ErrorHandler('ERROR: cant get comments', 404, e.message)
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
            return {
                result: 'comment that does not exist',
                status: 404,
            }
        }
        comment = await prisma.comment.findFirst({
            where: {
                id: fixId(commentId),
                postId: fixId(postId),
            },
        })
        if (comment == null) {
            return {
                result: 'comment is not related to post',
                status: 404,
            }
        }
        return { result: comment, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant read comment', 404, e.message)
    }
}

type likeJson = {
    like: boolean
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
            return {
                result: 'cant like a comment that does not exist ',
                status: 404,
            }
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
        throw new ErrorHandler('ERROR: cant like comment', 404, e.message)
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
        throw new ErrorHandler('ERROR: cant like comment', 404, e.message)
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
            return {
                result: 'cant dislike a comment that was not previously liked for user',
                status: 404,
            }
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
        throw new ErrorHandler('ERROR: cant dislike comment', 404, e.message)
    }
}

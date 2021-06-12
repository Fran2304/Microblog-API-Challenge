import { PrismaClient } from '@prisma/client'
import { likeJson, postType } from '../../type/types'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const createPost = async (authorId: number, params: postType) => {
    try {
        if (!params.title || !params.content) {
            throw new ErrorHandler(
                'ERROR: Content, title cant be empty',
                411,
                'ERROR: Content, title cant be empty'
            )
        }

        const today: Date = new Date()
        await prisma.post.create({
            data: {
                ...params,
                createdAt: today,
                published: params.published != null ? params.published : true,
                likesQuantity: 0,
                authorId: authorId,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant create post', 422, e.message)
    }
}

export const updatePost = async (
    authorId: number,
    postId: string,
    params: postType
) => {
    try {
        if (!params.title || !params.content) {
            throw new Error('ERROR: Content, title cant be empty')
        }
        const pId = fixId(postId)
        let postToUpdate = await prisma.post.findFirst({
            where: {
                id: pId,
            },
        })
        if (postToUpdate == null) {
            throw new Error('ERROR: cant update a post that does not exist')
        }
        postToUpdate = await prisma.post.findFirst({
            where: {
                id: pId,
                authorId: authorId,
            },
        })
        if (postToUpdate == null) {
            throw new Error(
                'ERROR: cant update post because does not belongs to user'
            )
        }
        await prisma.post.update({
            where: {
                id: pId,
            },
            data: {
                ...params,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const deletePost = async (authorId: number, postId: string) => {
    try {
        let postToDelete = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
            },
        })
        if (postToDelete == null) {
            throw new Error('ERROR: cant delete a post that does not exist')
        }
        postToDelete = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
                authorId: authorId,
            },
        })
        if (postToDelete == null) {
            throw new Error(
                'ERROR: cant delete a post that does not belongs to user'
            )
        }
        await prisma.post.delete({
            where: {
                id: fixId(postId),
            },
        })
        return { result: postToDelete, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const readPublishedPosts = async () => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },
        })
        return { result: posts, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const readPost = async (id: string) => {
    try {
        const post = await prisma.post.findFirst({
            where: {
                id: fixId(id),
            },
        })
        if (post == null) {
            throw new Error('ERROR: post that does not exist')
        }
        return { result: post, status: 200 }
    } catch (e) {
        console.log(e)
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const ProcessPostLike = async (
    authorId: number,
    postId: string,
    likeData: likeJson
) => {
    try {
        const pId = fixId(postId)
        let post = await prisma.post.findFirst({
            where: {
                id: pId,
            },
        })
        if (post == null) {
            throw new Error('ERROR: the post does not exist')
        }
        if (likeData.like) {
            likePost(authorId, pId, post.likesQuantity)
        } else {
            if (post.likesQuantity != 0) {
                dislikePost(authorId, pId, post.likesQuantity)
            }
        }
        return { result: null, status: 204 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const likePost = async (
    authorId: number,
    postId: number,
    quantity: number
) => {
    try {
        const postLike = await prisma.postLikes.findFirst({
            where: {
                postId: postId,
                authorId: authorId,
            },
        })
        if (postLike == null) {
            await prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    likesQuantity: quantity + 1,
                },
            })
            await prisma.postLikes.create({
                data: {
                    postId: postId,
                    authorId: authorId,
                    like: true,
                },
            })
        }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant like post', 404, e)
    }
}

export const dislikePost = async (
    authorId: number,
    postId: number,
    quantity: number
) => {
    try {
        const postLike = await prisma.postLikes.findFirst({
            where: {
                postId: postId,
                authorId: authorId,
            },
        })
        if (postLike == null) {
            throw new Error(
                'ERROR: cant dislike a post that was not previously liked for user'
            )
        }
        await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                likesQuantity: quantity - 1,
            },
        })
        await prisma.postLikes.delete({
            where: {
                id: postLike?.id,
            },
        })
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler(e.message, 404, e)
    }
}

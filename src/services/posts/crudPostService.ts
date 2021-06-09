import { PrismaClient } from '@prisma/client'
import { postType } from '../../type/types'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { fixId } from '../../Helpers/dataHelper'
import { userExist } from '../users/crudUserService'

const prisma = new PrismaClient()

export const createPost = async (authorId: string, params: postType) => {
    try {
        // if (!userExist(authorId)) {
        //     return { result: 'user does not exist', status: 404 }
        // }
        const today: Date = new Date()
        await prisma.post.create({
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
        throw new ErrorHandler('ERROR: cant create post', 404, e.message)
    }
}

export const updatePost = async (
    id: string,
    postId: string,
    params: postType
) => {
    try {
        let postToUpdate = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
            },
        })
        if (postToUpdate == null) {
            return {
                result: 'cant update a post that does not exist ',
                status: 404,
            }
        }
        postToUpdate = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
                authorId: fixId(id),
            },
        })
        if (postToUpdate == null) {
            return {
                result: 'cant update post because does not belongs to user',
                status: 404,
            }
        }
        await prisma.post.update({
            where: {
                id: fixId(postId),
            },
            data: {
                ...params,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant update post', 404, e.message)
    }
}

export const deletePost = async (id: string, postId: string) => {
    try {
        let postToDelete = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
            },
        })
        if (postToDelete == null) {
            throw new ErrorHandler(
                'ERROR: cant delete a post',
                404,
                'cant delete a post that does not exist'
            )
        }
        postToDelete = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
                authorId: fixId(id),
            },
        })
        if (postToDelete == null) {
            throw new ErrorHandler(
                'ERROR: cant delete a post',
                404,
                'cant delete a post that does not belongs to user'
            )
        }
        await prisma.post.delete({
            where: {
                id: fixId(postId),
            },
        })
        return { result: postToDelete, status: 200 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant delete post', 404, e.message)
    }
}

export const readPublishedPosts = async () => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },
        })
        if (posts.length == 0) {
            return { result: null, status: 404 }
        }
        return { result: posts, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant get posts', 404, e.message)
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
            return {
                result: 'post that does not exist',
                status: 404,
            }
        }
        return { result: post, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant read post', 404, e.message)
    }
}

export const ProcessPostLike = async (
    id: string,
    postId: string,
    like: boolean
) => {
    try {
        const userValid = await userExist(id)
        if (!userValid) {
            return { result: 'user does not exist', status: 404 }
        }
        let post = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
            },
        })
        if (post == null) {
            return {
                result: 'cant like a post that does not exist ',
                status: 404,
            }
        }
        if (like) {
            likePost(fixId(id), fixId(postId), post.likesQuantity)
        } else {
            if (post.likesQuantity != 0) {
                dislikePost(fixId(id), fixId(postId), post.likesQuantity)
            }
        }

        return { result: null, status: 204 }
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant like post', 404, e.message)
    }
}

const likePost = async (authorId: number, postId: number, quantity: number) => {
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
                    likesQuantity: quantity++,
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
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant update post', 404, e.message)
    }
}

const dislikePost = async (
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
            return {
                result: 'cant dislike a post that was not previously liked for user',
                status: 404,
            }
        }
        console.log('before update')
        console.log(quantity)
        await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                likesQuantity: quantity--,
            },
        })
        await prisma.postLikes.delete({
            where: {
                id: postLike?.id,
            },
        })
    } catch (e) {
        console.log(e.message)
        throw new ErrorHandler('ERROR: cant dislike post', 404, e.message)
    }
}

import { PrismaClient } from '@prisma/client'
import { Ipost } from '../../interfaces/post.interface'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const createPost = async (authorId: string, params: Ipost) => {
    try {
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

export const updatePost = async (id: string, postId: string, params: Ipost) => {
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
            return {
                result: 'cant delete a post that does not exist',
                status: 404,
            }
        }
        postToDelete = await prisma.post.findFirst({
            where: {
                id: fixId(postId),
                authorId: fixId(id),
            },
        })
        if (postToDelete == null) {
            return {
                result: 'cant delete a post that does not belongs to user',
                status: 404,
            }
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

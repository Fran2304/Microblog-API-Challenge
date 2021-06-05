import { PrismaClient } from '@prisma/client'
import { Ipost } from '../../interfaces/post.interface'
import { ErrorHandler } from '../../interfaces/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const getAllPosts = async (authorId: string) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: fixId(authorId),
                published: true,
            },
        })
        return { result: posts, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant get posts', 404, e.message)
    }
}

export const createPost = async (params: Ipost) => {
    try {
        await prisma.post.create({
            data: {
                ...params,
                likesQuantity: 0,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant create post', 404, e.message)
    }
}

export const updatePost = async (id: string, content: string) => {
    try {
        await prisma.post.update({
            where: {
                id: fixId(id),
            },
            data: {
                content: content,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant update post', 404, e.message)
    }
}

export const deletePost = async (id: string) => {
    try {
        const postToDelete = await prisma.post.findFirst({
            where: {
                id: fixId(id),
            },
        })
        await prisma.post.delete({
            where: {
                id: fixId(id),
            },
        })
        return { result: postToDelete, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant delete post', 404, e.message)
    }
}

export const readPost = async (id: string) => {
    try {
        const post = await prisma.post.findFirst({
            where: {
                id: fixId(id),
            },
        })
        return { result: post, status: 200 }
    } catch (e) {
        throw new ErrorHandler('ERROR: cant read post', 404, e.message)
    }
}

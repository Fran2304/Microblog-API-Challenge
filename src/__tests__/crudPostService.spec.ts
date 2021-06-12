/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client'
import { ErrorHandler } from './../errorHandler/errorHandler'

import {
    createPost,
    updatePost,
    deletePost,
    readPublishedPosts,
    readPost,
    ProcessPostLike,
} from '../services/posts/crudPostService'

const prisma = new PrismaClient()

beforeAll(async () => {
    // create user
    await prisma.user.createMany({
        data: [
            {
                email: 'flor@mundo.com',
                nickname: 'mariposa',
                firstName: 'ana',
                lastName: 'Zevallos',
                visibleEmail: false,
                visibleName: true,
                password: 'contrasena123',
                emailVerified: true,
                bio: 'estoy feliz de la vida',
                hashActivation: 'caracteresaleatorios1',
            },
            {
                email: 'rocio@mundo.com',
                nickname: 'corazon',
                firstName: 'rocio',
                lastName: 'Sanqui',
                visibleEmail: false,
                visibleName: true,
                password: 'contrasena456',
                emailVerified: false,
                bio: 'me gustan los chocolates',
                hashActivation: 'caracteresaleatorios2',
            },
        ],
    })
    const firstUser = await prisma.user.findFirst({
        where: {
            email: 'flor@mundo.com',
        },
    })

    const secondUser = await prisma.user.findFirst({
        where: {
            email: 'rocio@mundo.com',
        },
    })

    console.log('✨ 2 users successfully created!')
    const date: Date = new Date(2021, 1, 12)
    // create products
    await prisma.post.createMany({
        data: [
            {
                title: 'mi primer postre',
                createdAt: date,
                content: 'mi primer postre que hice fue chocotorta',
                published: true,
                likesQuantity: 0,
                authorId: firstUser?.id ?? 0,
            },
            {
                title: 'manualidades',
                createdAt: date,
                content: 'realizar una almohada',
                published: true,
                likesQuantity: 1,
                authorId: secondUser?.id ?? 0,
            },
        ],
    })

    const firstPost = await prisma.post.findFirst({
        where: {
            title: 'mi primer postre',
        },
    })

    const secondPost = await prisma.post.findFirst({
        where: {
            title: 'manualidades',
        },
    })
    console.log('✨ 2 posts successfully created!')

    // create the comment
    await prisma.comment.createMany({
        data: [
            {
                createdAt: date,
                content: 'delicioso',
                published: true,
                likesQuantity: 0,
                authorId: firstUser?.id ?? 0,
                postId: firstPost?.id ?? 0,
            },
            {
                createdAt: date,
                content: 'pasame la receta',
                published: true,
                likesQuantity: 0,
                authorId: secondUser?.id ?? 0,
                postId: firstPost?.id ?? 0,
            },
            {
                createdAt: date,
                content: 'cuales son los materiales',
                published: true,
                likesQuantity: 0,
                authorId: secondUser?.id ?? 0,
                postId: secondPost?.id ?? 0,
            },
        ],
    })

    console.log('✨ 2 comments successfully created!')

    await prisma.postLikes.createMany({
        data: [
            {
                authorId: 1,
                postId: 2,
            },
        ],
    })
})

// Test create

const examplePost = {
    title: 'la seleccion gano',
    content: 'Peru 2 Ecuador 1',
}
const emptyPost = {
    title: '',
    content: '',
}

describe('create a post', () => {
    it('should create a post', async () => {
        const postCreated = await createPost(1, examplePost)
        expect(postCreated.result).toHaveProperty('content', 'Peru 2 Ecuador 1')
    })
    it('should return an error if we dont pass anny content', async () => {
        await expect(createPost(1, emptyPost)).rejects.toThrowError(Error)
    })
})

// Test readPublishedPosts

describe('show all post published', () => {
    it('should return the number of post pusblished', async () => {
        const allPost = await readPublishedPosts()
        expect(allPost.result).toHaveLength(3)
        expect(allPost.result[0].title).toBe('mi primer postre')
    })
})
// Update post

const exampleUpdate = {
    title: 'que lindo dia',
    content: 'lindo sol',
}

describe('update a post', () => {
    it('should update the content of a post', async () => {
        const postUpdated = await updatePost(1, '1', exampleUpdate)
        expect(postUpdated.result).toHaveProperty('content', 'lindo sol')
    })
    it('should return error if the post does not exist', async () => {
        await expect(updatePost(2, '100', exampleUpdate)).rejects.toThrowError(
            ErrorHandler
        )
    })
    it('should return error if the post does not exist', async () => {
        await expect(updatePost(1, '2', exampleUpdate)).rejects.toThrowError(
            ErrorHandler
        )
    })
})

// Test readPosts

describe('read a post from a user', () => {
    it('should return a post from a user', async () => {
        const post = await readPost('1')
        expect(post.result).toHaveProperty('title')
    })

    it('should return an error if we pass a post id that not exists', async () => {
        await expect(readPost('100')).rejects.toThrowError(ErrorHandler)
    })
})

// Test process  like

const jsonLike = {
    like: true,
}

const jsonDislike = {
    like: false,
}
describe('process like', () => {
    it('should return an error if the post does not exist', async () => {
        await expect(ProcessPostLike(1, '10', jsonLike)).rejects.toThrowError(
            ErrorHandler
        )
    })

    // Like
    it('should return 1 if we give a like to a post that does not have any like', async () => {
        const postToLike = await ProcessPostLike(2, '1', jsonLike)
        expect(postToLike.result).toEqual(1)
    })

    it('should return error if we give a like to a post with like', async () => {
        await expect(ProcessPostLike(1, '2', jsonLike)).rejects.toThrowError(
            ErrorHandler
        )
    })

    // Dislike
    it('should return 0 if we give a dislike to a post that has 1 like', async () => {
        const postToDislike = await ProcessPostLike(1, '2', jsonDislike)
        console.log(postToDislike.result)
        expect(postToDislike.result).toEqual(0)
    })
    it('should return error if we give a dislike a post that was not previously liked for user', async () => {
        await expect(ProcessPostLike(2, '1', jsonLike)).rejects.toThrowError(
            ErrorHandler
        )
    })
})

// Test delete

describe('delete a post', () => {
    it('should return post deleted', async () => {
        const postToDelete = await deletePost(2, '2')
        expect(postToDelete.result).toHaveProperty('title', 'manualidades')
    })
    it('should return an error if we past a post that does not exist', async () => {
        await expect(deletePost(2, '100')).rejects.toThrowError(ErrorHandler)
    })

    it('should return an error if the post does not belong to user', async () => {
        await expect(deletePost(1, '1')).rejects.toThrowError(ErrorHandler)
    })
})

const clearDatabase = async function () {
    const tableNames = ['Comment', 'Post', 'User']
    try {
        for (const tableName of tableNames) {
            await prisma.$queryRaw(`DELETE FROM "${tableName}";`)
            if (!['Store'].includes(tableName)) {
                await prisma.$queryRaw(
                    `ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH 1;`
                )
            }
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
    } finally {
        await prisma.$disconnect()
    }
}

afterAll(async () => {
    await clearDatabase()
    const deleteComment = prisma.comment.deleteMany()
    const deletePost = prisma.post.deleteMany()
    const deleteUserDetails = prisma.user.deleteMany()
    await prisma.$transaction([deleteUserDetails, deletePost, deleteComment])
    // await prisma.$disconnect()
})

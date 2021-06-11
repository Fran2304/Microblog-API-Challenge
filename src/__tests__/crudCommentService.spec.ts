/* eslint-disable no-undef */
// import * as request from 'supertest'
import { PrismaClient } from '@prisma/client'
// import express from 'express'
// import { app } from '../../server'
import { ErrorHandler } from './../errorHandler/errorHandler'

import {
    createComment,
    readComment,
    updateComment,
    deleteComment,
    readPublishedComments,
    // ProcessCommentLike,
    // likeComment,
    // dislikeComment
} from '../services/comments/crudCommentService'

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
                likesQuantity: 0,
                authorId: secondUser?.id ?? 0,
            },
            {
                title: 'los rompecabezas',
                createdAt: date,
                content: '100 piezas',
                published: true,
                likesQuantity: 0,
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
})

// Test create a comment
const exampleComment = {
    content: 'Peru 2 Ecuador 1',
}
const emptyComment = {
    content: '',
}

describe('create a comment', () => {
    it('should return an error if we dont pass any content', async () => {
        await expect(
            createComment('1', '1', emptyComment)
        ).rejects.toThrowError(ErrorHandler)
    })
    it('should return an error if we dont pass any content', async () => {
        await expect(
            createComment('1', '1', emptyComment)
        ).rejects.toThrowError(ErrorHandler)
    })
    it('should create a comment', async () => {
        const postCreated = await createComment('1', '1', exampleComment)
        const expected = { result: null, status: 204 }
        expect(postCreated).toEqual(expected)
    })
})

// Test update

const exampleUpdate = {
    content: 'i purple you',
}

describe('update a comment', () => {
    it('should update a comment', async () => {
        const postCreated = await updateComment('1', '1', '1', exampleUpdate)
        const expected = { result: null, status: 204 }
        expect(postCreated).toEqual(expected)
    })
    it('should return an error if the comment does not exist', async () => {
        await expect(
            updateComment('1', '1', '100', exampleUpdate)
        ).rejects.toThrowError(Error)
    })

    it('should return an error if the comment is not related to a post', async () => {
        await expect(
            updateComment('2', '1', '3', exampleUpdate)
        ).rejects.toThrowError(Error)
    })

    it('should return an error if the comment is not related to the author', async () => {
        await expect(
            updateComment('1', '2', '3', exampleUpdate)
        ).rejects.toThrowError(Error)
    })
})

// Test delete
describe('delete a comment', () => {
    it('should return comment deleted', async () => {
        const commentToDelete = await deleteComment('2', '2', '3')
        expect(commentToDelete.result).toHaveProperty(
            'content',
            'cuales son los materiales'
        )
    })
    it('should return an error if we past a comment that does not exist', async () => {
        await expect(deleteComment('1', '1', '100')).rejects.toThrowError(
            ErrorHandler
        )
    })

    it('should return an error if the comment does not belong to post', async () => {
        await expect(deleteComment('1', '2', '1')).rejects.toThrowError(
            ErrorHandler
        )
    })

    it('should return an error if the comment does not belong to user', async () => {
        await expect(deleteComment('2', '1', '1')).rejects.toThrowError(
            ErrorHandler
        )
    })
})

// Test read published comment
describe('read all published comments', () => {
    it('should all comments published', async () => {
        const comments = await readPublishedComments('1')
        expect(comments.result).toHaveLength(2)
    })
    it('should return null if we pass a post without comments', async () => {
        const comments = await readPublishedComments('3')
        await expect(comments.result).toBe(null)
    })
})
// Test read comment
describe('read a comment', () => {
    it('should return a coment', async () => {
        const comment = await readComment('1', '1')
        expect(comment.result).toHaveProperty('content', 'delicioso')
    })
    it('should return an error if we pass a comment id that not exists', async () => {
        await expect(readComment('1', '100')).rejects.toThrowError(ErrorHandler)
    })
    it('should return an error if the comment is not realted to the post', async () => {
        await expect(readComment('2', '2')).rejects.toThrowError(ErrorHandler)
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

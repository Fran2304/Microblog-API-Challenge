/* eslint-disable no-undef */
// import * as request from 'supertest'
import { PrismaClient } from '@prisma/client'
// import express from 'express'
// import { app } from '../../server'

// import {
//     readPost,
//     readPublishedPosts,
//     deletePost,
//     createPost,
//     updatePost,
// } from '../services/posts/crudPostService'

import { readPost } from '../services/posts/crudPostService'
// import { ErrorHandler } from './../errorHandler/errorHandler'

const prisma = new PrismaClient()

beforeEach(async () => {
    const deleteComment = prisma.comment.deleteMany()
    const deletePost = prisma.post.deleteMany()
    const deleteUserDetails = prisma.user.deleteMany()
    await prisma.$transaction([deleteUserDetails, deletePost, deleteComment])
    // create product categories
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

describe('read a post from a user', () => {
    it('should return a post from a user', async () => {
        const post = await readPost('24')
        expect(post.result).toHaveProperty('title')
    })
    // it('should return an error if we pass an user that not exists', async () => {
    //     const postviewed = await readPost('100')
    //     const expected = {
    //         result: 'post that does not exist',
    //         status: 404,
    //     }
    //     expect(postviewed).toEqual(expected)
    // })
    // Cuando ocurre el catch ?
})

// describe('show all post published', () => {
//     it('should return all posts published', async () => {
//         const allPost = await readPublishedPosts()
//         const expected = [
//             {
//                 id: 1,
//                 title: 'mi primer postre',
//                 createdAt: new Date('2021-02-12T05:00:00.000Z'),
//                 content: 'mi primer postre que hice fue chocotorta',
//                 published: true,
//                 likesQuantity: 0,
//                 authorId: 1,
//             },
//             {
//                 id: 2,
//                 title: 'manualidades',
//                 createdAt: new Date('2021-02-12T05:00:00.000Z'),
//                 content: 'realizar una almohada',
//                 published: true,
//                 likesQuantity: 0,
//                 authorId: 2,
//             },
//         ]
//         expect(allPost.result).toEqual(expected)
//     })
// })

// describe('delete a post', () => {
//     it('should return post deleted', async () => {
//         const postToDelete = await deletePost('1', '8')
//         const expected = {
//             authorId: 1,
//             content: expect.any(String),
//             createdAt: expect.any(Date),
//             id: 8,
//             likesQuantity: expect.any(Number),
//             published: expect.any(Boolean),
//             title: expect.any(String),
//         }
//         expect(postToDelete.result).toEqual(expected)
//     })
//     // it('should return an error if we past a post that does not exist', async () => {
//     //     const postToDelete = await deletePost('2', '100')
//     //     const expected = {
//     //         result: 'cant delete a post that does not exist',
//     //         status: 404,
//     //     }
//     //     expect(postToDelete).toEqual(expected)
//     // })

//     // it('should return an error if the post does not belong to user', async () => {
//     //     const postToDelete = await deletePost('1', '2')
//     //     const expected = {
//     //         result: 'cant delete a post that does not belongs to user',
//     //         status: 404,
//     //     }
//     //     expect(postToDelete).toEqual(expected)
//     // })
// })

// const examplePost = {
//     title: 'la seleccion gano',
//     content: 'Peru 2 Ecuador 1',
// }
// describe('create a post', () => {
//     it('should create a post', async () => {
//         const postCreated = await createPost('1', examplePost)
//         const expected = { result: null, status: 204 }
//         expect(postCreated).toEqual(expected)
//     })
// })

// const exampleUpdate = {
//     title: 'que lindo dia',
//     content: 'lindo sol',
// }

// describe('update a post', () => {
//     it('should update the content of a post', async () => {
//         const postUpdated = await updatePost('1', '9', exampleUpdate)
//         const expected = { result: null, status: 204 }
//         expect(postUpdated).toEqual(expected)
//     })
// })

// describe('process post likes', () => {
//     it('should give a like', async () => {})
// })

afterAll(async () => {
    await prisma.$disconnect()
})

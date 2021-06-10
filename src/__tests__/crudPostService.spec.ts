/* eslint-disable no-undef */
// import * as request from 'supertest'
// import { PrismaClient } from '@prisma/client'
// import express from 'express'
// import { app } from '../../server'
import { ErrorHandler } from '../errorHandler/errorHandler'
import {
    readPost,
    readPublishedPosts,
    //deletePost,
    createPost,
} from '../services/posts/crudPostService'

//import { ErrorHandler, MyError } from './../errorHandler/errorHandler'
// const prisma = new PrismaClient()

// beforeEach(async () => {
//     await prisma.comment.deleteMany({})
//     await prisma.post.deleteMany({})
//     await prisma.user.deleteMany({})
// })

beforeAll((done) => {
    done()
})

describe.only('read a post from a user', () => {
    it('should return a post from a user', async () => {
        const postviewed = await readPost('1')
        const expected = {
            id: 1,
            title: 'mi primer postre',
            createdAt: new Date('2021-02-12T05:00:00.000Z'),
            content: 'mi primer postre que hice fue chocotorta.',
            published: true,
            likesQuantity: 0,
            authorId: 1,
        }
        expect(postviewed.result).toEqual(expected)
    })
    it('should return an error if we pass a post id that not exists', async () => {
        await expect(readPost('100')).rejects.toThrowError(ErrorHandler)
    })
})

describe('show all post published', () => {
    it('should return all posts published', async () => {
        const allPost = await readPublishedPosts()
        const expected = [
            {
                id: 1,
                title: 'mi primer postre',
                createdAt: new Date('2021-02-12T05:00:00.000Z'),
                content: 'mi primer postre que hice fue chocotorta',
                published: true,
                likesQuantity: 0,
                authorId: 1,
            },
            {
                id: 2,
                title: 'manualidades',
                createdAt: new Date('2021-02-12T05:00:00.000Z'),
                content: 'realizar una almohada',
                published: true,
                likesQuantity: 0,
                authorId: 2,
            },
        ]
        expect(allPost.result).toEqual(expected)
    })
})

describe('delete a Post', () => {
    // it('should return post deleted', async () => {
    //     const postToDelete = await deletePost('1', '100')
    //     const expected = {
    //
    //     }
    //     expect(postToDelete.result).toEqual(expected)
    // })
    it('should return an error if we past a post that does not exist', async () => {
        //const postToDelete = await deletePost('2', '100')
        // const expected = {
        //     result: 'cant delete a post that does not exist',
        //     status: 404,
        // }
        // expect(postToDelete).rejects.toThrowError(
        //     new ErrorHandler(
        //         'ERROR: cant delete a post',
        //         404,
        //         'cant delete a post that does not exist'
        //     )
        // )
    })

    it('should return an error if the post does not belong to user', async () => {
        // const postToDelete = await deletePost('1', '2')
        // // const expected = {
        // //     result: 'cant delete a post that does not belongs to user',
        // //     status: 404,
        // // }
        // expect(postToDelete).rejects.toThrowError(
        //     new ErrorHandler(
        //         'ERROR: cant delete a post',
        //         404,
        //         'cant delete a post that does not belongs to user'
        //     )
        // )
    })
})

const examplePost = {
    title: 'la seleccion gano',
    content: 'Peru 2 Ecuador 1',
}
describe('create a post', () => {
    it('should create a post', async () => {
        const postCreated = await createPost('1', examplePost)
        const expected = {
            ...examplePost,
            createdAt: expect.any(Date),
            published: true,
            likesQuantity: 0,
            authorId: 1,
        }
        expect(postCreated.result).toEqual(expected)
    })
})

// afterAll((done) => {
//     // Closing the DB connection allows Jest to exit successfully.
//     done()
//     prisma.$disconnect()
// })

// prisma.$on('beforeExit', async () => {
//     // PrismaClient still available
//     await prisma.message.create({
//       data: {
//         message: "Shutting down server";
//       }
// })

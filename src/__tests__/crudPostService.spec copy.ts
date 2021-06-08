/* eslint-disable no-undef */
// import * as request from 'supertest'
import { PrismaClient } from '@prisma/client'
// import express from 'express'
// import { app } from '../../server'
// import { readComment } from '../services/comments/crudCommentService'
const prisma = new PrismaClient()

// beforeEach(async () => {
//     await prisma.comment.deleteMany({})
//     await prisma.post.deleteMany({})
//     await prisma.user.deleteMany({})
// })

// const exampleUser = {
//     email: 'spiderman@gmail.com',
//     nickname: 'parker',
//     firstName: 'Micaela',
//     lastName: 'Rojas',
//     password: '12345',
//     hashActivation: '222222222',
// }

describe('read a comment', () => {
    it('should return a coment', async () => {
        // const comment = await readComment('2')
        const postviewed = await prisma.post.findFirst({
            where: {
                id: 2,
            },
        })
        const expected = {
            id: 2,
            createdAt: new Date('2021-02-12T05:00:00.000Z'),
            content: 'pasame la receta',
            published: true,
            likesQuantity: 0,
            authorId: 2,
            postId: 1,
        }
        expect(postviewed).toEqual(expected)
    })
})

// describe('creat a new user', () => {
//     it('should return a lowercase string  if we pass capital letters', async () => {
//         console.log('welcome')
//     })
// })

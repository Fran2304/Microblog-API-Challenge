/* eslint-disable no-undef */

import { PrismaClient } from '@prisma/client'
import { ErrorHandler } from './../errorHandler/errorHandler'

import { signUpUser } from './../services/auth/authService'

const prisma = new PrismaClient()

beforeAll(async () => {
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
})

const userRegistered = {
    email: 'rocio@mundo.com',
    nickname: 'corazon',
    firstName: 'rocio',
    lastName: 'Sanqui',
    password: 'contrasena456',
    hashActivation: '222222222',
    visibleEmail: true,
    visibleName: true,
}

const newUser = {
    email: 'spiderman@gmail.com',
    nickname: 'parker',
    firstName: 'Micaela',
    lastName: 'Rojas',
    password: '12345',
    visibleEmail: true,
    visibleName: true,
    hashActivation: '222222222',
}

describe('create a post', () => {
    it('should create a user', async () => {
        const postCreated = await signUpUser(newUser)
        expect(postCreated.result).toHaveProperty('content', 'Peru 2 Ecuador 1')
    })
    it('should return an error if the user exist', async () => {
        await expect(signUpUser(userRegistered)).rejects.toThrowError(
            ErrorHandler
        )
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

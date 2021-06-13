/* eslint-disable no-undef */

import { PrismaClient } from '@prisma/client'
import { ErrorHandler } from '../errorHandler/errorHandler'

import {
    readUserService,
    updateUserService,
} from './../services/users/crudUserService'

const prisma = new PrismaClient()

beforeAll(async () => {
    await prisma.user.createMany({
        data: [
            {
                email: 'flor@mundo.com',
                nickname: 'mariposa',
                firstName: 'Ana',
                lastName: 'Zevallos',
                visibleEmail: true,
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
                visibleName: false,
                password: 'contrasena456',
                emailVerified: false,
                bio: 'me gustan los chocolates',
                hashActivation: 'caracteresaleatorios2',
            },
        ],
    })
    console.log('users created')
})

describe('read a user', () => {
    it('should get a user', async () => {
        const postCreated = await readUserService(1)
        expect(postCreated.result).toHaveProperty('nickname', 'mariposa')
    })
    it('should return an error if the user does not exist', async () => {
        await expect(readUserService(100)).rejects.toThrowError(ErrorHandler)
    })
    it('should show the email if it is visible', async () => {
        const postCreated = await readUserService(1)
        expect(postCreated.result).toHaveProperty('email', 'flor@mundo.com')
    })
    it('should not return the email if it is not visible', async () => {
        const postCreated = await readUserService(2)
        expect(postCreated.result).toHaveProperty('email', '')
    })
    it('should show the name and lastname if it is visible', async () => {
        const postCreated = await readUserService(1)
        expect(postCreated.result).toHaveProperty('firstName', 'Ana')
        expect(postCreated.result).toHaveProperty('lastName', 'Zevallos')
    })

    it('should not return firstName and lastName if it is not visible', async () => {
        const postCreated = await readUserService(2)
        expect(postCreated.result).toHaveProperty('firstName', '')
        expect(postCreated.result).toHaveProperty('lastName', '')
    })
})

const nothingToUpdate = {
    firstName: '',
    lastName: '',
    nickname: '',
    bio: '',
}

const infoToUpdate = {
    firstName: 'Maria',
    lastName: 'arteaga',
    visibleEmail: true,
    visibleName: true,
    nickname: 'sylormoon',
    bio: 'que felicidad',
}

const nicknameRepeated = {
    nickname: 'la',
}

describe('update user', () => {
    it('should return an error if the user does not exist', async () => {
        await expect(updateUserService(100, infoToUpdate)).rejects.toThrowError(
            ErrorHandler
        )
    })
    it('should return an error if we dont pass anything to update', async () => {
        await expect(
            updateUserService(1, nothingToUpdate)
        ).rejects.toThrowError(ErrorHandler)
    })
    it('should return an error if the user does not exist', async () => {
        await expect(
            updateUserService(2, nicknameRepeated)
        ).rejects.toThrowError(ErrorHandler)
    })
    it('should update fields of the user', async () => {
        const updated = await updateUserService(1, infoToUpdate)
        expect(updated.result).toHaveProperty('firstName', 'Maria')
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

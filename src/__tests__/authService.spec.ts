/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client'
import { ErrorHandler } from './../errorHandler/errorHandler'

import {
    checkPassword,
    generatePassword,
    newToken,
    verifyToken,
} from '../services/auth/authService'
import { JsonWebTokenError } from 'jsonwebtoken'

const prisma = new PrismaClient()

// eslint-disable-next-line no-unused-vars
const userToSignIn = {
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
}

describe('generate password', () => {
    const pass = 'contrasena123'
    it('should generate a hashed password', async () => {
        const passwordHashed = await generatePassword(pass)
        expect(typeof passwordHashed).toBe('string')
    })
    it('should return an error if cant generate password', async () => {
        await expect(generatePassword('')).rejects.toThrowError(ErrorHandler)
    })
})

describe('generate token', () => {
    const userId = 1
    it('should generate a token', async () => {
        const token = newToken(userId)
        expect(typeof token).toBe('string')
    })
})

describe('verify token', () => {
    const userToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTYyMzUzMjY1NywiZXhwIjoxNjIzNTUwNjU3fQ.WrfweFNOxalB7eHbAiMIvkCuSSfyX6l1W1Z5qfjqqOc'
    it('should verify a token', async () => {
        const payload = verifyToken(userToken)
        expect(payload).toHaveProperty('id')
    })
    it('should throw an error if token is empty', async () => {
        const payload = verifyToken('')
        expect(payload).rejects.toThrow(JsonWebTokenError)
    })
    it('should throw an error if token is modified', async () => {
        const payload = verifyToken(userToken.substring(0, 1))
        expect(payload).rejects.toThrow(JsonWebTokenError)
    })
})

describe('check password', () => {
    const plainPassword = 'cotrasena123'
    const passwordInDB =
        '$2b$08$MCw6jNcOcXfen/euSpuhM..Y.NjNsLUSkZjC1tnP.E5NDz6TGcuPW'

    it('should return true if passwords match', async () => {
        expect(await checkPassword(passwordInDB, plainPassword)).toEqual(true)
    })
    it('should throw an error if given password is empty', async () => {
        expect(await checkPassword(passwordInDB, '')).toEqual(false)
    })
    it('should throw an error if given password is incorrect', async () => {
        expect(await checkPassword(passwordInDB, 'contrasena')).toEqual(false)
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

/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client'
import { ErrorHandler } from './../errorHandler/errorHandler'

import {
    checkPassword,
    generatePassword,
    newToken,
    signOutUser,
    signUpUser,
    verifyToken,
} from '../services/auth/authService'
import { JsonWebTokenError } from 'jsonwebtoken'
import { userType } from '../type/types'

const prisma = new PrismaClient()

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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTYyMzU1OTUxNywiZXhwIjoxNjI0NDIzNTE3fQ.F0YItXJJ6Q0kZy22a2z4P-EYv4F407DwU_S7-dwQVzQ'
    it('should verify a token', async () => {
        const payload = await verifyToken(userToken)
        expect(payload).toHaveProperty('id')
    })
    it('should throw an error if token is empty', async () => {
        await expect(verifyToken('')).rejects.toThrow(JsonWebTokenError)
    })
    it('should throw an error if token is modified', async () => {
        await expect(verifyToken(userToken.substring(0, 1))).rejects.toThrow(
            JsonWebTokenError
        )
    })
})

describe('check password', () => {
    const plainPassword = 'cotrasena123'
    const passwordInDB =
        '$2b$08$MCw6jNcOcXfen/euSpuhM..Y.NjNsLUSkZjC1tnP.E5NDz6TGcuPW'

    it('should return true if passwords match', async () => {
        expect(await checkPassword(passwordInDB, plainPassword)).toEqual(true)
    })
    it('should return false if given password is empty', async () => {
        expect(await checkPassword(passwordInDB, '')).toEqual(false)
    })
    it('should return false if given password is incorrect', async () => {
        expect(await checkPassword(passwordInDB, 'contrasena')).toEqual(false)
    })
})

describe('sign up user', () => {
    const user: userType = {
        email: 'flor002@mundo.com',
        nickname: 'flor002',
        firstName: 'flor',
        lastName: 'Zevallos',
        password: 'hola',
        bio: 'estoy feliz de la vida',
        hashActivation: '',
        visibleEmail: true,
        visibleName: false,
    }

    it('should create a user', async () => {
        const signUp = await signUpUser(user)
        expect(signUp).toHaveProperty('code')
    })
    const userNoPassword: userType = {
        email: 'flor002@mundo.com',
        nickname: 'flor002',
        firstName: 'flor',
        lastName: 'Zevallos',
        password: '',
        bio: 'estoy feliz de la vida',
        hashActivation: '',
        visibleEmail: true,
        visibleName: false,
    }
    it('should throw an error if a required field is empty', async () => {
        await expect(signUpUser(userNoPassword)).rejects.toThrowError(
            ErrorHandler
        )
    })
    it('should throw an error if there is a user registered', async () => {
        await expect(signUpUser(user)).rejects.toThrowError(ErrorHandler)
    })
})

describe('sign out user', () => {
    const userToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIzNTYyNjczLCJleHAiOjE2MjM1ODA2NzN9.UHSwy-JqqWaQwm_3bQCWBx0f1hZ5-V9b-98PROGH_yQ'

    it('should log out a user', async () => {
        const singout = await signOutUser(userToken)
        expect(singout.result).toEqual(true)
    })
    it('should throw an error if the token is corrupted', async () => {
        await expect(
            signOutUser(userToken.substring(0, 4))
        ).rejects.toThrowError(ErrorHandler)
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

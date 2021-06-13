/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client'
import { ErrorHandler } from './../errorHandler/errorHandler'

import {
    checkPassword,
    generatePassword,
    newToken,
    signUpUser,
    signOutUser,
    signInUser,
    verifyToken,
    protect,
} from '../services/auth/authService'
import { JsonWebTokenError } from 'jsonwebtoken'
import { userType, userTypeLogin } from '../type/types'

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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIzNjAyMjczLCJleHAiOjE2MzIyNDIyNzN9.6MZ3AsKlbSoqk8_FC9PdZ26cvelvfTserdHyGZD3sSE'
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
        expect(await signUpUser(user)).toHaveProperty('code')
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

describe('sign in user', () => {
    const user: userTypeLogin = {
        email: 'flor002@mundo.com',
        password: 'hola',
    }

    it('should sign in the user and receive a token', async () => {
        const userLogged = await signInUser(user)
        console.log(userLogged)
        expect(typeof userLogged.result).toBe('string')
    })

    const userNoInfo: userTypeLogin = {
        email: '',
        password: '',
    }
    it('should throw an error if there are not email nor password', async () => {
        await expect(signInUser(userNoInfo)).rejects.toThrowError(ErrorHandler)
    })

    const userWrongEmail: userTypeLogin = {
        email: 'flor11111@mundo.com',
        password: 'hola',
    }
    it('should throw an error if the email is wrong', async () => {
        await expect(signInUser(userWrongEmail)).rejects.toThrowError(
            ErrorHandler
        )
    })

    const userWrongPassword: userTypeLogin = {
        email: 'flor002@mundo.com',
        password: 'chau',
    }

    it('should throw an error if the password is wrong', async () => {
        await expect(signInUser(userWrongPassword)).rejects.toThrowError(
            ErrorHandler
        )
    })
})

describe('protect', () => {
    const userTokenEmpty = ''

    it('should throw error if the token is empty', async () => {
        await expect(protect(userTokenEmpty)).rejects.toThrowError(Error)
    })

    const userTokenWrong = 'vbmkmkfgmkxcmvvnfjgnujnhjfngv'
    it('should throw error if the token is wrong', async () => {
        await expect(protect(userTokenWrong)).rejects.toThrowError(Error)
    })

    const userToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIzNjAyMjczLCJleHAiOjE2MzIyNDIyNzN9.6MZ3AsKlbSoqk8_FC9PdZ26cvelvfTserdHyGZD3sSE'
    it('should allow login', async () => {
        const protectUser = await protect(userToken)
        expect(protectUser.result).toBe(1)
    })
})

describe('sign out user', () => {
    const userToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIzNjAyMjczLCJleHAiOjE2MzIyNDIyNzN9.6MZ3AsKlbSoqk8_FC9PdZ26cvelvfTserdHyGZD3sSE'
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

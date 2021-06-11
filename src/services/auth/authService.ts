import { PrismaClient } from '@prisma/client'
import { userType } from '../../type/types'
import { ErrorHandler } from '../../errorHandler/errorHandler'

const prisma = new PrismaClient()

const generatePassword = async (plainTextPassword: string): Promise<string> => {
    return new Promise((resolve) => {
        bcrypt.hash(plainTextPassword, 8, (err, hash) => {
            if (err) {
                reject(err)
                throw new ErrorHandler(
                    'ERROR: Cant generate hash or password',
                    409,
                    err.message
                )
            }
            resolve(hash)
        })
    })
}

export const newToken = (userId: number) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

export const verifyToken = (token: string) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
            if (err) {
                reject(err)
                throw new Error('ERROR: Cant verify token')
            }
            resolve(payload)
        })
    })

export const checkPassword = (
    passwordInDB: string,
    passwordSend: string
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(passwordSend, passwordInDB, (err, same) => {
            if (err) {
                reject(err)
                throw new Error('ERROR: Passwords dont match')
            }
            resolve(same)
        })
    })
}

export const signInUser = async (params: userType) => {
    try {
        if (!params.email || !params.password) {
            throw new Error('need email and password')
        }
        const readUser = await prisma.user.findUnique({
            where: {
                email: params.email,
            },
        })
        if (readUser == null) {
            throw new Error('ERROR: invalid email')
        }
        const pass = await checkPassword(readUser.password, params.password)
        if (!pass) {
            throw new ErrorHandler('ERROR: passwords dont match', 401, '')
        }
        const token = newToken(readUser.id)
        return { result: token, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 401, e)
    }
}

export const signUpUser = async (params: userType) => {
    try {
        const createdUser = await prisma.user.create({
            data: {
                ...params,
            },
        })
        return { result: createdUser, status: 201 }
    } catch (e) {
        throw new ErrorHandler('cant create users', 404, e.message)
    }
}

export const readUserService = async (params: userType) => {
    try {
        const readUser = await prisma.user.findUnique({
            where: {
                email: params.email,
            },
        })
        return { result: readUser?.id, status: 200 }
    } catch (e) {
        throw new ErrorHandler('cant get user', 404, e.message)
    }
}

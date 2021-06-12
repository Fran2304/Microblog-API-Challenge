/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client'
import { confirmationType, tokenPayload, userType } from '../../type/types'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { plainToClass } from 'class-transformer'
import { UserDto } from '../../Dtos/userDto'
import { generateHash } from '../../Helpers/createHashHelper'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { sendMailOfConfirmationCode } from '../../Helpers/emailSender'
import { isNumber, reject } from 'lodash'

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
                throw new ErrorHandler(
                    'ERROR: Cant verify token',
                    403,
                    'ERROR: Cant verify token'
                )
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

export const signUpUser = async (params: userType) => {
    try {
        const userRead = await prisma.user.findUnique({
            where: {
                email: params.email,
            },
        })
        if (userRead != null) {
            throw new ErrorHandler(
                'ERROR: the email is already registered',
                409,
                'ERROR: the email is already registered'
            )
        }
        const passwordHashed = await generatePassword(params.password)
        const confirmationCode = generateHash()
        const createdUser = await prisma.user.create({
            data: {
                ...params,
                password: passwordHashed,
                hashActivation: confirmationCode,
            },
        })
        if (createdUser) {
            sendMailOfConfirmationCode(createdUser.email, confirmationCode)
        }

        return { result: plainToClass(UserDto, createdUser), status: 201 }
    } catch (e) {
        console.log(e)
        throw new ErrorHandler(e.message, e.status ?? 404, e)
    }
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
        await prisma.user.update({
            where: {
                id: readUser.id,
            },
            data: {
                active: true,
            },
        })
        const token = newToken(readUser.id)
        return { result: token, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 401, e)
    }
}

export const signOutUser = async (token: string) => {
    try {
        const payload = (await verifyToken(token)) as tokenPayload
        if (!isNumber(payload.id)) {
            throw new Error('ERROR: invalid user id')
        }
        const readUser = await prisma.user.findUnique({
            where: {
                id: payload.id,
            },
        })
        if (readUser == null) {
            throw new Error('ERROR: invalid user id')
        }
        await prisma.user.update({
            where: {
                id: readUser.id,
            },
            data: {
                active: false,
            },
        })
        return { result: true, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, e.status ?? 401, e)
    }
}

export const verifyCode = async (codeSent: confirmationType) => {
    try {
        if (!codeSent.confirmationCode) {
            throw new Error('confirmation code cant be empty')
        }
        const readUser = await prisma.user.findFirst({
            where: {
                hashActivation: codeSent.confirmationCode,
            },
        })
        if (readUser == null) {
            throw new Error('ERROR: invalid code')
        }
        if (readUser.emailVerified === true) {
            throw new Error('ERROR: the user already has confirmed the email')
        }
        await prisma.user.update({
            where: {
                id: readUser.id,
            },
            data: {
                emailVerified: true,
            },
        })
        return { result: true, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 401, e)
    }
}

export const protect = async (token: string) => {
    try {
        if (!token) {
            throw new Error('ERROR: token cant be empty')
        }
        const payload = (await verifyToken(token)) as tokenPayload
        const user = await prisma.user.findUnique({
            where: {
                id: payload.id,
            },
        })
        if (user == null) {
            throw new Error('ERROR: invalid user id')
        }
        if (!user.active) {
            throw new Error('ERROR: user needs to sign in first')
        }
        return { result: user.id, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 401, e)
    }
}

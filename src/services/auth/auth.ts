/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client'
import { userType } from '../../type/types'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { plainToClass } from 'class-transformer'
import { UserDto } from '../../Dtos/userDto'
import { generateHash } from '../../Helpers/createHashHelper'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const generatePassword = async (plainTextPassword: string): Promise<string> => {
    return new Promise((resolve) => {
        bcrypt.hash(plainTextPassword, 8, (err, hash) => {
            if (err) {
                throw new ErrorHandler(
                    'ERROR: Passwords dont match',
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
        expiresIn: '100d',
    })
}
export const checkPassword = (password: string): Promise<boolean> => {
    const passwordHash = password
    return new Promise((resolve) => {
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
                throw new ErrorHandler(
                    'ERROR: Passwords dont match',
                    409,
                    err.message
                )
            }
            resolve(same)
        })
    })
}

export const createUserService = async (params: userType) => {
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
        const createdUser = await prisma.user.create({
            data: {
                ...params,
                password: passwordHashed,
                hashActivation: generateHash(),
            },
        })
        return { result: plainToClass(UserDto, createdUser), status: 201 }
    } catch (e) {
        console.log(e)
        throw new ErrorHandler(e.message, e.status ?? 404, e)
    }
}

export const readUserService = async (params: userType) => {
    try {
        const readUser = await prisma.user.findUnique({
            where: {
                email: params.email,
            },
        })
        if (readUser == null) {
            throw new Error('ERROR: invalid email')
        }
        return { result: readUser.id, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 401, e)
    }
}

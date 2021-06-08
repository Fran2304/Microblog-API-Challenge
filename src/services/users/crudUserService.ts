import { PrismaClient } from '@prisma/client'
import { Iuser } from '../../interfaces/user.interface'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { fixId } from '../../Helpers/dataHelper'

const prisma = new PrismaClient()

export const userExist = async (authorId: string) => {
    try {
        const userFound = await prisma.user.findFirst({
            where: {
                id: fixId(authorId),
            },
        })
        return userFound !== null
    } catch (e) {
        console.log(e)
        throw new ErrorHandler('ERROR: cant find user', 404, e.message)
    }
}

export const createUserService = async (params: Iuser) => {
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

export const readUserService = async (params: Iuser) => {
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

export const updateUserService = async (id: string, params: Iuser) => {
    try {
        await prisma.user.update({
            where: {
                id: fixId(id),
            },
            data: {
                ...params,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('cant update comment', 404, e.message)
    }
}

export const showEmailUserService = async (
    id: string,
    visibleEmail: boolean
) => {
    try {
        await prisma.user.update({
            where: {
                id: fixId(id),
            },
            data: {
                visibleEmail: visibleEmail,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('cant update comment', 404, e.message)
    }
}

export const showNameUserService = async (id: string, visibleName: boolean) => {
    try {
        await prisma.user.update({
            where: {
                id: fixId(id),
            },
            data: {
                visibleName: visibleName,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('cant update comment', 404, e.message)
    }
}

// export const getAllUsers = async () => {
//     const users = await prisma.user.findMany({})
//     return { result: users, status: 200 }
// }

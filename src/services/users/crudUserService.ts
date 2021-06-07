import { PrismaClient } from '@prisma/client'
import { Iuser } from '../../interfaces/user.interface'
import { ErrorHandler } from '../../interfaces/errorHandler'

const prisma = new PrismaClient()

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

export const updateUserService = async (email: string, bio: string) => {
    try {
        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                bio: bio,
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

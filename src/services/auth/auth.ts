import { PrismaClient } from '@prisma/client'
import { Iuser } from '../../interfaces/user.interface'
import { ErrorHandler } from '../../errorHandler/errorHandler'

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

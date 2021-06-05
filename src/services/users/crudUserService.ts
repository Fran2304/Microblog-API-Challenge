import { PrismaClient } from '@prisma/client'
import { Iuser } from '../../interfaces/user.interface'
const prisma = new PrismaClient()

export const createUserService = async (params: Iuser) => {
    await prisma.user.create({
        data: {
            ...params,
        },
    })
    return 'created user'
}

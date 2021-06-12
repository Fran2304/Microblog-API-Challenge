import { PrismaClient } from '@prisma/client'
import { userType } from '../../type/types'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { plainToClass } from 'class-transformer'
import { UserDto } from '../../Dtos/userDto'

const prisma = new PrismaClient()

export const readUserService = async (id: number) => {
    try {
        const readUser = await prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        //const userDto= new UserUpdateDto();
        return { result: plainToClass(UserDto, readUser), status: 200 }
    } catch (e) {
        throw new ErrorHandler('cant get user', 404, e)
    }
}

export const updateUserService = async (id: number, params: userType) => {
    try {
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                ...params,
            },
        })
        return { result: null, status: 204 }
    } catch (e) {
        throw new ErrorHandler('cant update user', 404, e)
    }
}

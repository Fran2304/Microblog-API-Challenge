import { PrismaClient } from '@prisma/client'
import { updateUserType } from '../../type/types'
import { ErrorHandler } from '../../errorHandler/errorHandler'
import { plainToClass } from 'class-transformer'
import { UserUpdateDto } from '../../Dtos/userDto'

const prisma = new PrismaClient()

export const readUserService = async (id: number) => {
    try {
        const readUser = await prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        if (!readUser) {
            throw new Error('ERROR: user does not exist')
        }
        const userDto = new UserUpdateDto()
        userDto.nickname = readUser.nickname
        if (readUser.visibleEmail) {
            userDto.email = readUser.email
        }
        if (readUser.visibleName) {
            userDto.firstName = readUser.firstName
            userDto.lastName = readUser.lastName
        }
        if (readUser.bio) {
            userDto.bio = readUser.bio
        }

        return { result: plainToClass(UserUpdateDto, userDto), status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 404, e)
    }
}

export const updateUserService = async (id: number, params: updateUserType) => {
    try {
        if (!id) {
            throw new Error('ERROR: user does not exist')
        }
        if (
            !params.firstName &&
            !params.lastName &&
            !params.visibleEmail &&
            !params.visibleName &&
            !params.visibleEmail &&
            !params.bio
        ) {
            throw new Error('ERROR: Cant update empty fields')
        }
        if (params.nickname) {
            const readUser = await prisma.user.findUnique({
                where: {
                    nickname: params.nickname,
                },
            })
            if (readUser) {
                throw new Error(
                    'ERROR: nickname is already used for another account'
                )
            }
        }
        const userUpdated = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                ...params,
            },
        })
        return { result: userUpdated, status: 200 }
    } catch (e) {
        throw new ErrorHandler(e.message, 404, e)
    }
}

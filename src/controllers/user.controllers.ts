import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const createService = async function () {
    // eslint-disable-next-line no-unused-vars
    await prisma.user.create({
        data: {
            email: 'gatita@gmail.com',
            nickname: 'michi',
            firstName: 'Micaela',
            lastName: 'Rojas',
            password: '12345',
            hashActivation: '222222222',
        },
    })
    return 'created user'
}

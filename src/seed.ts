/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client'

const users = [
    {
        email: 'ana@mundo.com',
        nickname: 'burbuja',
        firstName: 'ana',
        lastName: 'Zevallos',
        visibleEmail: false,
        visibleName: true,
        password: 'contrasena123',
        emailVerified: true,
        bio: 'estoy feliz de la vida',
        hashActivation: 'caracteresaleatorios1',
    },
    {
        email: 'rocio@mundo.com',
        nickname: 'bombom',
        firstName: 'rocio',
        lastName: 'Sanqui',
        visibleEmail: false,
        visibleName: true,
        password: 'contrasena456',
        emailVerified: false,
        bio: 'me gustan los chocolates',
        hashActivation: 'caracteresaleatorios2',
    },
]

const date: Date = new Date(2021, 1, 12)
const posts = [
    {
        title: 'mi primer postre',
        createdAt: date,
        content: 'mi primer postre que hice fue chocotorta',
        published: true,
        likesQuantity: 0,
        authorId: 1,
    },
    {
        title: 'manualidades',
        createdAt: date,
        content: 'realizar una almohada',
        published: true,
        likesQuantity: 0,
        authorId: 2,
    },
]

const comments = [
    {
        createdAt: date,
        content: 'delicioso',
        published: true,
        likesQuantity: 0,
        authorId: 1,
        postId: 1,
    },
    {
        createdAt: date,
        content: 'pasame la receta',
        published: true,
        likesQuantity: 0,
        authorId: 2,
        postId: 1,
    },
]

const prisma = new PrismaClient()

async function main() {
    // for(let user of users){
    //     await prisma.user.create({data:user});
    // }
    for (let post of posts) {
        await prisma.post.create({ data: post })
    }
    for (let comment of comments) {
        await prisma.comment.create({ data: comment })
    }
}
main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

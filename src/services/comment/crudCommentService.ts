import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// export const getAllComments= authorId=>{
//     //const comment = await prisma.Comment.get();

// };

export const createService = async (authorId: number) => {
    await prisma.comment.create({
        data: {
            createdAt: '',
            content: '',
            likesQuantity: 0,
            authorId: authorId,
            postId: 1,
        },
    })
    return 'hola'
}

import express from 'express'
import * as postService from '../services/posts/crudPostService'

export const createPost = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const create = await postService.createPost(req.user.id, req.body)
    res.status(create.status).json({ data: create.result }).end()
}

export const updatePost = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    if (!JSON.stringify(req.body).includes('like')) {
        const update = await postService.updatePost(
            req.user.id,
            req.params.postId,
            req.body
        )
        res.status(update.status).json({ data: update.result })
    } else {
        const likePost = await postService.ProcessPostLike(
            req.user.id,
            req.params.postId,
            req.body
        )
        res.status(likePost.status).json({ data: likePost.result })
    }
}

export const deletePost = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const deletion = await postService.deletePost(
        req.user.id,
        req.params.postId
    )
    res.status(deletion.status).json({ data: deletion.result })
}

export const getPosts = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const allPosts = await postService.readPublishedPosts()
    res.status(allPosts.status).json({ data: allPosts.result })
}

export async function readPost(
    req: express.Request,
    res: express.Response
): Promise<void> {
    const read = await postService.readPost(req.params.id)
    res.status(read.status).json({ data: read.result })
}

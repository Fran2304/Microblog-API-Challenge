import express from 'express'
import * as postService from '../services/posts/crudPostService'

export const createPost = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const create = await postService.createPost(req.params.id, req.body)
        res.status(create.status).end()
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const updatePost = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const update = await postService.updatePost(
            req.params.id,
            req.params.postId,
            req.body
        )
        res.status(update.status).json({ data: update.status })
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const deletePost = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const deletion = await postService.deletePost(
            req.params.id,
            req.params.postId
        )
        res.status(deletion.status).json({ data: deletion.result })
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const getPosts = async (req: express.Request, res: express.Response) => {
    try {
        const allPosts = await postService.readPublishedPosts()
        res.status(allPosts.status).json({ data: allPosts.result })
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const readPost = async (req: express.Request, res: express.Response) => {
    try {
        const read = await postService.readPost(req.params.id)
        res.status(read.status).json({ data: read.result })
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

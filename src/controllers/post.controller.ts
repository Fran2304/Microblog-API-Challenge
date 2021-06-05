import express from 'express'
import * as postService from '../services/post/crudPostService'

export const getPosts = async (req: express.Request, res: express.Response) => {
    try {
        const allComments = await postService.getAllPosts(req.params.id)
        if (allComments.result.length == 0) {
            res.status(allComments.status).json({
                data: 'no comments for user',
            })
        } else {
            res.status(allComments.status).json({ data: allComments.result })
        }
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const createPost = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const create = await postService.createPost(req.body)
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
            req.params.content
        )
        res.status(update.status).end()
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const deletePost = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const deletion = await postService.deletePost(req.params.id)
        res.status(deletion.status).json({ data: deletion.result })
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

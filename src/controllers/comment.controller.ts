import express from 'express'
import * as commentService from '../services/comments/crudCommentService'

export const createComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const create = await commentService.createComment(
            req.params.id,
            req.params.postId,
            req.body
        )
        res.status(create.status).end()
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const updateComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const update = await commentService.updateComment(
            req.params.id,
            req.params.postId,
            req.params.commentId,
            req.body
        )
        res.status(update.status).json({ data: update.result })
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const deleteComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const deletion = await commentService.deleteComment(
            req.params.id,
            req.params.postId,
            req.params.commentId
        )
        res.status(deletion.status).json({ data: deletion.result })
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const getComments = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const allComments = await commentService.readPublishedComments(
            req.params.id
        )
        res.status(allComments.status).json({ data: allComments.result })
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

export const readComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const read = await commentService.readComment(
            req.params.id,
            req.params.commentId
        )
        res.status(read.status).json({ data: read.result })
    } catch (err) {
        res.status(err.status).json({ data: err.message })
    }
}

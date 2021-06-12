import express from 'express'
import * as commentService from '../services/comments/crudCommentService'

export const createComment = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const create = await commentService.createComment(
        req.user.id,
        req.params.postId,
        req.body
    )
    res.status(create.status).json({ data: create.result }).end()
}

export const updateComment = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    if (!JSON.stringify(req.body).includes('like')) {
        const update = await commentService.updateComment(
            req.user.id,
            req.params.postId,
            req.params.commentId,
            req.body
        )
        res.status(update.status).json({ data: update.result })
    } else {
        const likeComment = await commentService.ProcessCommentLike(
            req.user.id,
            req.params.postId,
            req.params.commentId,
            req.body
        )
        res.status(likeComment.status).json({ data: likeComment.result })
    }
}

export const deleteComment = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const deletion = await commentService.deleteComment(
        req.user.id,
        req.params.postId,
        req.params.commentId
    )
    res.status(deletion.status).json({ data: deletion.result })
}

export const getComments = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
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
): Promise<void> => {
    const read = await commentService.readComment(
        req.params.id,
        req.params.commentId
    )
    res.status(read.status).json({ data: read.result })
}

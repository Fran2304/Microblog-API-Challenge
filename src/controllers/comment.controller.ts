import express from 'express'

// eslint-disable-next-line no-unused-vars
import * as commentService from '../services/comment/crudCommentService'

export const getComments = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const allComments = await commentService.getAllComments(req.params.id)
        //.lean()
        //.exec()
        res.status(200).json({ data: allComments })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const postComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        res.status(200).json({ data: 'hola' })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const updateComment = (req: express.Request, res: express.Response) => {
    res.status(200).json({ data: 'hola' })
}

export const deleteComment = (req: express.Request, res: express.Response) => {
    res.status(200).json({ data: 'hola' })
}

export const getComment = (req: express.Request, res: express.Response) => {
    res.status(200).json({ data: 'hola' })
}

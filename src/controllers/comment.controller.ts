import express from 'express'
//import { ErrorHandler } from '../interfaces/error.interface'
import * as commentService from '../services/comment/crudCommentService'

export const getComments = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const allComments = await commentService.getAllComments(req.params.id)
        //.lean()
        //.exec()
        res.status(allComments.status).json({ data: allComments.result })
    } catch (e) {
        res.status(e.status).json({ data: e.result })
    }
}

export const createComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        await commentService.createComment(req.body)
        res.status(204).end()
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const updateComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        await commentService.updateComment(req.params.id, req.params.content)
        res.status(204).end()
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const deleteComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        await commentService.deleteComment(req.params.id)
        res.status(200).end()
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const readComment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        await commentService.readComment(req.params.id)
        res.status(204).end()
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

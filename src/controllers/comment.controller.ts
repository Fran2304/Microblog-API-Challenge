import express from 'express'


// eslint-disable-next-line no-unused-vars
import * as commentService from '../services/comment/crudCommentService'

export const getComments = (req: express.Request, res: express.Response) => {
    //llamar aca all service
    //await commentService.getAllComments(1)
    //     //   .then(response => ApiResponse.success(res, response))
    //     //   .catch(err => ApiResponse.error(res, err));

    res.status(200).json({ data: 'hola' })
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

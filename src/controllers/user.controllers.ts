import express from 'express'

import * as userService from '../services/users/crudUserService'

export const createUser = async (
    req: express.Request,
    res: express.Response
) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' })
    }
    try {
        const user = await userService.createUserService(req.body)
        return res.status(201).send({ user })
    } catch (e) {
        console.error(e)
        return res.status(400).end()
    }
}

export const getUser = (req: express.Request, res: express.Response) => {
    res.status(200).json({ data: 'hola' })
}

export const updateUser = (req: express.Request, res: express.Response) => {
    res.status(200).json({ data: 'hola' })
}

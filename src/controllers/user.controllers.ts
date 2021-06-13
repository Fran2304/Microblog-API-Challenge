import express from 'express'
import * as userService from '../services/users/crudUserService'

export const updateUser = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const updatedUser = await userService.updateUserService(
        req.user.id,
        req.body
    )
    res.status(updatedUser.status).json({ data: 'User updated' })
}

export const readUser = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const user = await userService.readUserService(req.user.id)
    res.status(user.status).json({ data: user.result })
}

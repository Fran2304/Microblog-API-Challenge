import express, { NextFunction } from 'express'
import { sendMailOfConfirmationCode } from '../Helpers/emailSender'
import * as userService from '../services/auth/authService'

export const signup = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ data: 'need email and password' })
    }
    const user = await userService.signUpUser(req.body)

    if (user) {
        const isSent = sendMailOfConfirmationCode(user.result.email, user.code)
        if (isSent) {
            const token = userService.newToken(user.result.id)
            res.status(user.status).json({
                data: 'Complete registration',
                token: token,
            })
        } else {
            res.status(user.status).json({
                data: 'Complete registration, but email cant be sent',
            })
        }
    }
}

export const signin = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const user = await userService.signInUser(req.body)
    if (user.result) {
        res.status(201).json({
            data: 'Correct authentication',
            token: user.result,
        })
    }
}

export const signout = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const authToken = req.headers.authorization as string
    const user = await userService.signOutUser(authToken)
    if (user.result) {
        res.status(201).json({
            data: 'Sign out correct',
        })
    }
}

export const verifyConfirmationCode = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const isVerified = await userService.verifyCode(req.body)
    if (isVerified.result) {
        res.status(200).json({
            data: 'Correct email verification',
        })
    }
}

export const protect = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
) => {
    const authToken = req.headers.authorization as string
    const userRead = await userService.protect(authToken)
    if (!userRead) {
        return res.status(401).json({
            data: 'user is not authorized',
        })
    }
    req.user = { id: userRead.result }
    next()
}

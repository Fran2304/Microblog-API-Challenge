import express from 'express'
import * as userService from '../services/auth/authService'

export const signup = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ message: 'need email and password' })
    }
    const user = await userService.signUpUser(req.body)
    if (user) {
        const token = userService.newToken(user.result.id)

        res.status(user.status).json({
            mensaje: 'Complete registration',
            token: token,
        })
    }
}

export const signin = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const user = await userService.signInUser(req.body)
    if (user.result) {
        res.status(201).json({
            mensaje: 'Correct authentication',
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
            mensaje: 'Sing out correct',
            token: user.result,
        })
    }
}

export const verifyConfirmationCode = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const isVerified = await userService.VerifyCode(req.body)
    if (isVerified.result) {
        res.status(200).json({
            mensaje: 'Correct email verification',
        })
    }
}
// export const protect = async (
//     req: express.Request,
//     res: express.Response,
//     next: NextFunction
// ) => {
//     const bearer = req.headers.authorization

//     if (!bearer || !bearer.startsWith('Bearer ')) {
//         return res.status(401).end()
//     }

//     const token = bearer.split('Bearer ')[1]
//     let payload
//     try {
//         payload = await verifyToken(token)
//     } catch (e) {
//         return res.status(401).end()
//     }

//     const user = await prisma.user.findUnique({
//         where: {
//             id: payload.id,
//         },
//     })

//     if (!user) {
//         return res.status(401).end()
//     }

//     req.body.user = user
//     next()
// }

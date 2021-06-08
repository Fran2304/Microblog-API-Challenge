import express from 'express'
// import express, { NextFunction } from 'express'
import * as userService from '../services/users/crudUserService'
import jwt from 'jsonwebtoken'
import config from '../../config'

// import { PrismaClient } from '@prisma/client' // protect
// const prisma = new PrismaClient() // protect

// interface IPayload {
//     sub: string
//     id: number
//     iat: string
// }

export const newToken = (userId: number) => {
    return jwt.sign({ id: userId }, config.secrets.jwt as string, {
        expiresIn: config.secrets.jwtExp,
    })
}

// ojito con el type token
export const verifyToken = (token: string) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.secrets.jwt as string, (err, payload) => {
            if (err) return reject(err)
            resolve(payload)
        })
    })

export const signup = async (req: express.Request, res: express.Response) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' })
    }
    try {
        const user = await userService.createUserService(req.body)
        const token = newToken(user.result.id)
        return res
            .status(user.status)
            .json({ mensaje: 'Complete registration', token: token })
    } catch (e) {
        console.error(e)
        return res.status(500).end()
    }
}

export const signin = async (req: express.Request, res: express.Response) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' })
    }
    const invalid = { message: 'Invalid email and passoword combination' }
    try {
        const user = await userService.readUserService(req.body)
        if (!user.result) {
            return res.status(401).send(invalid)
        }
        const token = newToken(user.result)
        return res
            .status(201)
            .json({ mensaje: 'Autenticación correcta', token: token })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
}

export const updateUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const updatedUser = await userService.updateUserService(
            req.params.id,
            req.body
        )
        res.status(updatedUser.status).json({ message: updatedUser.status })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

// export const protect = async (req: express.Request, res: express. Response, next: NextFunction) => {
//     const token = req.headers ['access-token'];
//     if (token) {
//       jwt.verify (token, app.get('secrets'), (err , decoded) => {
//         if (err) {
//           return res.json ({mensaje: 'Token inválida'});
//         } else {
//           req.body.user = user;
//           next ();
//         }
//       });
//     } else {
//       res.send ( {
//           mensaje: 'Token no proveída.'
//       });
//     }
// };

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

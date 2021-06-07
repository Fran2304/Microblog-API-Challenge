import express from 'express'
// import express, { NextFunction } from 'express'
import * as userService from '../services/users/crudUserService'
import jwt from 'jsonwebtoken'
// import bodyParser from 'body-parser'

export const app = express()

// import { PrismaClient } from '@prisma/client' // protect
// const prisma = new PrismaClient() // protect

const secrets = {
    jwt: 'gatita',
    jwtExp: '100d',
}

export const newToken = (userId: number) => {
    return jwt.sign({ id: userId }, secrets.jwt, {
        expiresIn: secrets.jwtExp,
    })
}

// ojito con el type token
export const verifyToken = (token: string) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, secrets.jwt, (err, payload) => {
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
        return res.status(201).send({ token })
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
        if (!user) {
            return res.status(401).send(invalid)
        }
        // const token = newToken(user.result)
        return res.status(201).send({ user })
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

// export const getAllUsers = (req: express.Request, res: express.Response) => {
//     res.status(200).json({ data: 'hola' })
// }

import cors from 'cors'
import express, { Request, Response, NextFunction } from 'express'
import { json, urlencoded } from 'body-parser'
import usersRouter from './src/routes/users.router'
import postsUserRouter from './src/routes/postUsers.router'
import postsRouter from './src/routes/posts.router'
import commentsUserRouter from './src/routes/commentUsers.router'
import commentsRouter from './src/routes/comments.router'

import * as dotenv from 'dotenv'

import { signin, signup } from './src/controllers/auth.controllers'
import { ErrorHandler } from './src/errorHandler/errorHandler'

dotenv.config()

export const app = express()

// eslint-disable-next-line no-undef
app.set('secrets', process.env.JWT_SECRET)

app.disable('x-powered-by')

app.use(cors())
app.use(json())

app.use(urlencoded({ extended: false }))

app.post('/signup', signup)
app.post('/signin', signin)

// app.use('/api', protect)
app.use('/api/accounts', usersRouter)

app.use('/api/accounts/:id/posts', postsUserRouter)
app.use('/api/posts', postsRouter)

app.use('/api/accounts/:id/posts/:postId/comments', commentsUserRouter)
app.use('/api/posts/:id/comments', commentsRouter)
console.log(app.routes)

function errorManager(
    err: ErrorHandler,
    req: Request,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line
    next: NextFunction
): void {
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === 'development') {
        console.log(`Detail: ${err.detail}`)
    }
    res.status(err.status ?? 500).json(err.message)
}

app.use(errorManager)

export const start = async () => {
    try {
        app.listen(3002, () => {
            console.log(`REST API on http://localhost:${3002}/`)
        })
    } catch (e) {
        console.error(e)
    }
}

start()

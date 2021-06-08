import cors from 'cors'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import config from './config'
import usersRouter from './src/routes/users.router'
import postsUserRouter from './src/routes/postUsers.router'
import postsRouter from './src/routes/posts.router'
import commentsUserRouter from './src/routes/commentUsers.router'
import commentsRouter from './src/routes/comments.router'

import * as dotenv from 'dotenv'

import { signin, signup } from './src/controllers/user.controllers'

dotenv.config()

export const app = express()

app.set('secrets', config.secrets.jwt)

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

app.use('/api/accounts/:id/posts/:postId', commentsUserRouter)
app.use('/api/posts/:postId/comments', commentsRouter)

export const start = async () => {
    try {
        app.listen(config.port, () => {
            console.log(`REST API on http://localhost:${config.port}/`)
        })
    } catch (e) {
        console.error(e)
    }
}

start()

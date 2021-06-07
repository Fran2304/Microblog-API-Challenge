import cors from 'cors'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import usersRouter from './src/routes/users.router'
import postsUserRouter from './src/routes/postUsers.router'
import postsRouter from './src/routes/posts.router'
import commentsUserRouter from './src/routes/commentUsers.router'
import commentsRouter from './src/routes/comments.router'

import * as dotenv from 'dotenv'
dotenv.config()

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

app.use('/api/accounts', usersRouter)
app.use('/api/accounts/:id/posts', postsUserRouter)
app.use('/api/posts', postsRouter)

app.use('/api/accounts/:id/posts/:postId', commentsUserRouter)
app.use('/api/posts/:postId/comments', commentsRouter)

// Start server
// eslint-disable-next-line no-undef
const port = process.env.PORT

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`REST API on http://localhost:${port}/`)
        })
    } catch (e) {
        console.error(e)
    }
}

start()

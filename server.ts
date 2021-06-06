import cors from 'cors'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import usersRouter from './src/routes/users.router'
import postsRouter from './src/routes/posts.router'
import commentsRouter from './src/routes/comments.router'
import * as dotenv from 'dotenv'

import { signin, signup } from './src/controllers/user.controllers'

dotenv.config()

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

app.post('/signup', signup)
app.post('/signin', signin)

// app.use('/api', protect)
app.use('/api/accounts', usersRouter)
app.use('/api/accounts/:id/comments', commentsRouter)
app.use('/api/accounts/:id/posts', postsRouter)

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

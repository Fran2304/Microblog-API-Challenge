import cors from 'cors'
import express = require('express')
import { json, urlencoded } from 'body-parser'
import usersRouter from './src/routes/users.router'
import postsRouter from './src/routes/posts.router'
import commentsRouter from './src/routes/comments.router'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

app.use('/api/accounts', usersRouter)
app.use('/api/accounts/:id/comments', commentsRouter)
app.use('/api/accounts/:id/posts', postsRouter)

// Start server
const port = 3002

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

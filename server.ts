import express = require('express')

const port = 3002
const app = express()

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

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido' })
})

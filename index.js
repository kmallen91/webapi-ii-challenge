const express = require('express')

const blogRouter = require('./posts-router')

const server = express()
server.use(express.json())

server.get('/', (req, res) => {
    res.send(`
    <h2> Blog Post API </h2>
    `)
})

server.use(`/api/posts`, blogRouter)

server.listen(8000, () => {
    console.log(`Server Running on localhost:8000`)
})
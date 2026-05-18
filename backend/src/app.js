const express = require('express')

const toolRoutes = require('./routes/tool.routes')

const app = express()

app.use(express.json())

app.use('/tools', toolRoutes)

module.exports = app
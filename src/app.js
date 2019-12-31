require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const listingsRouter = require('./listings/routes')
// const RecipeService = require('./recipes-service')
const authRouter = require('./auth/auth-router')
//const searchRouter = require('./search/routes')
// const suppliesRouter = require('./supplies/routes')
const usersRouter = require('./users/routes')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors());

app.use('/api/auth', authRouter)
app.use('/api/listings', listingsRouter)
//app.use('/api/search', searchRouter)
// app.use('/api/supplies', suppliesRouter)
app.use('/api/users', usersRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})


module.exports = app
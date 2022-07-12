const router = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')

router.get('/', async (request, response) => {
    // send a short html page informing that the app is running in test mode
    response.send('<p>This is app is running in test mode. </p>')
})

router.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = router

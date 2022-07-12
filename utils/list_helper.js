const _ = require('lodash')

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
    if(!blogs){
        throw new Error('No blogs provided')
    }
    return _.chain(blogs)
        .groupBy('author')
        .map((value, key) => ({author: key, blogs: value.length}))
        .sortBy('blogs')
        .last()
        .value()
}

const mostLikes = (blogs) => {
    if(!blogs){
        throw new Error('No blogs provided')
    }
    return _.chain(blogs)
        .groupBy('author')
        .map((value, key) => ({author: key, likes: totalLikes(value)}))
        .sortBy('likes')
        .last()
        .value()
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

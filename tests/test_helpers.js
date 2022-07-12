const User = require('../models/users')
const Blog = require('../models/blogs')
const bcrypt = require('bcrypt')
const initialBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0,
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0,
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0,
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
    }
]
const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
        user: '62b86dca7c62db81533ee830'
    }]
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const initializeTestDatabase = async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash1 = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', name: 'root',  passwordHash: passwordHash1 })
    await user.save()
    const passwordHash2 = await bcrypt.hash('testsecret', 10)
    const testUser = new User({ username: 'test', name: 'test', passwordHash: passwordHash2 })
    await testUser.save()
    console.log(testUser._id)
    // add user to each blog
    initialBlogs.forEach(blog => {
        blog.user = testUser._id
    })
    await Blog.insertMany(initialBlogs)
    // add blogs to test user
    initialBlogs.forEach(blog => {
        testUser.blogs = testUser.blogs.concat(blog._id)
    })
    await testUser.save()

}

const getUserName = async (id) => {
    const user = await User.findById(id)
    return user.username
}

module.exports = {
    initialBlogs,
    listWithOneBlog,
    usersInDb,
    initializeTestDatabase,
    getUserName
}

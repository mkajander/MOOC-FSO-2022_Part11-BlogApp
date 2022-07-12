const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const {initialBlogs, initializeTestDatabase,  getUserName} = require('./test_helpers')

const api = supertest(app)



describe('when the user is not logged in', () => {
    beforeEach(async () => {
        await initializeTestDatabase()
    })
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('a specific blogs is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
        expect(titles).toContain(
            'Go To Statement Considered Harmful'
        )
    })

    test('blog _id should be named id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('blog can be updated', async () => {
        const updatedBlog = {
            id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 15,
        }
        const response = await api.put('/api/blogs/' + initialBlogs[0]._id).send(updatedBlog)
        // logically checking the expected update and the status code in the same test makes sense not sure if it is correct
        // though
        expect(response.body.likes).toBe(15)
        expect(response.statusCode).toBe(200)
    })
    test('blog cannot be deleted', async () => {
        const response = await api.delete('/api/blogs/' + initialBlogs[0]._id)
        console.log('response.body', response.body)
        expect(response.statusCode).toBe(401)
    })
    test('blog cannot be added', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Test author',
            url: 'http://www.test.com',
            likes: 42
        }
        const response = await api.post('/api/blogs').send(newBlog)
        expect(response.statusCode).toBe(401)
    })
})


describe('when the user is logged in', () => {
    let token = ''
    beforeEach(async () => {
        await initializeTestDatabase()
        const res = await api.post('/api/login').send(user)
        token = res.body.token
    })
    const user = {
        username: 'test',
        password: 'testsecret'
    }
    test('a blog can be added', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Test author',
            url: 'http://www.test.com',
            likes: 42
        }
        const response = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog)
        expect(response.statusCode).toBe(201)
    })
    test('token bearer is added as user to blog', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Test author',
            url: 'http://www.test.com',
            likes: 42
        }
        const response = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog)
        expect(response.body.user).toBeDefined()
        expect( await getUserName(response.body.user)).toBe('test')
    })
    test('a blog should have a related user', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Test author',
            url: 'http://www.test.com',
            likes: 42
        }
        const response = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog)
        console.log(response.body)
        expect(response.body.user).toBeDefined()
    })

    test('undefined likes should be set to 0', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Test author',
            url: 'http://www.test.com',
        }
        const response = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog)
        expect(response.body.likes).toBe(0)
    })

    test('blog must have title', async () => {
        const newBlog = {
            author: 'Test author',
            url: 'http://www.test.com',
            likes: 42
        }
        const response = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog)
        expect(response.statusCode).toBe(400)
    })

    test('blog must have url', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Test author',
            likes: 42
        }
        const response = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog)
        expect(response.statusCode).toBe(400)
    })
    test('blog cannot be deleted if token bearer is not attached user', async () => {
        const res = await api.post('/api/login').send({username: 'root', password: 'secret'})
        const wrongUserToken = res.body.token
        const response = await api.delete('/api/blogs/' + initialBlogs[0]._id).set('Authorization', `bearer ${wrongUserToken}`).send()
        expect(response.statusCode).toBe(401)
    })
    test('blog can be deleted if token bearer is attached user', async () => {
        const response = await api.delete('/api/blogs/' + initialBlogs[0]._id).set('Authorization', `bearer ${token}`).send()
        expect(response.statusCode).toBe(204)
    })
    test('cannot delete a non-existing blog', async () => {
        const response = await api.delete('/api/blogs/' + '5a422aa71b54a676234d17f4').set('Authorization', `bearer ${token}`).send()
        expect(response.statusCode).toBe(404)
    })


})

afterAll(async () => {
    await mongoose.connection.close()
})

const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helpers')
const {initializeTestDatabase} = require('./test_helpers')

const api = supertest(app)

describe('when there is initially two users at db', () => {
    beforeEach(async () => {
        await initializeTestDatabase()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mkajander',
            name: 'Mikael Kajander',
            password: 'lknalfLAKNNSF!!%nlaksn2',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salasana',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mkajander',
            name: 'Mikael Kajander',
            password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password must be at least 3 characters')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails if password is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mkajander',
            name: 'Mikael Kajander',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username and password are required')

        // double check from db
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails if username is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Mikael Kajander',
            password: 'salasana',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username and password are required')

        // double check from db
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('can get users', async () => {
        const users = await api.get('/api/users')
        expect(users.body.length).toBe(2)
    })

    test('get users should not return password hash', async () => {
        const users = await api.get('/api/users')
        expect(users.body[0].passwordHash).toBeUndefined()
    })

    test('get users should return related blogs', async () => {
        const users = await api.get('/api/users')
        console.log(users)
        expect(users.body[0].blogs).toBeDefined()
    })

    test('should be able to login', async () => {
        const users = await api.post('/api/login').send({
            username: 'test',
            password: 'testsecret',
        })
        expect(users.body.token).toBeDefined()
    })
})

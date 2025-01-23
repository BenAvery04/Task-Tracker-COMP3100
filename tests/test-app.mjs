import assert from 'assert'
import request from 'supertest'
import app from '../app.mjs'
import { describe, suite, test, beforeEach, after } from 'node:test'

var user1 = {
    name: "Test User",
    password: "testtest123"
}


var task1 = {
    user: "Test User",
    name: "Testing 1",
    description: "This is a test"
}

var update_data = {
    user: "Test User",
    name: "Updated Test",
    description: "This test was updated",
    assign: "Tester2"
}

var taskid = 0

suite('Test API calls',function(){
    test('Post user and task', async function () {
        let server_agent = request.agent(app)

        let response = await server_agent.post('/user').send(user1)
        assert.strictEqual(response.text, 'user added')

        response = await server_agent.post('/123').send(task1)
        let message = response.text.substring(0,22)
        taskid = response.text.substring(22)
        assert.strictEqual(message,"Task Created with id: ")
    })

    test('Get user and task', async function () {
        let server_agent = request.agent(app)

        //Test getting a user
        let response = await server_agent.get('/user').send(user1)
        assert.strictEqual(response.body.name, user1.name)

        //Test getting a task
        response = await server_agent.get('/123/'+taskid)
        assert.strictEqual(response.body.name, task1.name)

        //Test getting a invallid task
        response = await server_agent.get('/123/notatask')
        assert.strictEqual(response.text, "Task Not Found")
    })

    test('Upating task', async function () {
        let server_agent = request.agent(app)

        let response = await server_agent.post('/123/'+taskid+'/update').send(update_data)
        assert.strictEqual(response.text, 'Task Updated')

        response = await server_agent.get('/123/'+taskid)
        console.log(response.body)
        assert.strictEqual(response.body.name, update_data.name)
        assert.strictEqual(response.body.description, update_data.description)
        assert.strictEqual(response.body.assigned[0], update_data.assign)

        //Test getting a invallid task
        response = await server_agent.post('/123/notatask/update').send(update_data)
        assert.strictEqual(response.text,"Task not Found")
    })

    test('Checking Task History', async function () {
        let server_agent = request.agent(app)

        let response = await server_agent.get('/123/'+taskid+'/history')
        assert.strictEqual(response.body[0].user,task1.user)
        let date = response.body[0].date
        response = await server_agent.get('/123/'+taskid+'/history/'+date)
        assert.strictEqual(response.body.name, task1.name)
    })

    test('Deleting Task', async function () {
        let server_agent = request.agent(app)

        let response = await server_agent.post('/123/'+taskid)
        assert.strictEqual(response.text,"Task Deleted")

        //Test getting a invallid task
        response = await server_agent.post('/123/'+taskid)
        assert.strictEqual(response.text,"Task not Found")
    })
})
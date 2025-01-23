import { MongoClient } from 'mongodb';
import { User,Task,ListHeader } from './appClasses.mjs';
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
var db;

export async function _connect(){
    try {
        await client.connect()
        db = await client.db('taskapp')

    } catch(err) {
        throw err
    }
    return await db
}

export async function _connectdb(collection){
    try {
        await client.connect()
        db = await client.db('taskapp')

    } catch(err) {
        throw err
    }
    return await db.collection(collection)
}

export async function _closedb(){
    await client.close()
    return 'connection closed'
}

export async function addItem(db,item){
    let collection = await _connectdb(db)
    await collection.insertOne(item)
    _closedb()
    return true
}

export async function getItems(db,taskId=null,getHeader=false){
    let collection = await _connectdb(db)
    let find = {}
    if (taskId == "header"){
        find = {'id': "header"}
    }
    else if (taskId){
        find = {'id': Number(taskId)}
    }
    let tasks = await collection.find(find).toArray()
    var header
    if (getHeader){
        header = await collection.find({'id': "header"}).toArray()
        header = new ListHeader(header[0].users)
    }
    _closedb()
    let result = []
    for (let t of tasks){
        if (t.id == "header")
            var item = new ListHeader(t.users)
        else{
            var item = new Task(t.id,t.name,t.description,t.history,t.assigned,t.status)
        }
        result.push(item)
    }
    //result = tasks.map(t => new Task(t.id,t.name,t.description,t.history,t.assigned))
    if (getHeader){
        result.push(header)
    }
    return result
}

export async function updateItem(db,taskId,body){
    let collection = await _connectdb(db);
    let find = {'id': Number(taskId)}
    let tasks = await collection.find(find).toArray()
    if (tasks.length == 0){
        return false
    }

    let task = new Task(tasks[0].id,tasks[0].name,tasks[0].description,tasks[0].history,tasks[0].assigned,tasks[0].status)
    if ('taskname' in body){
        task.updateName(body.taskname)
    }
    if ('description' in body){
        task.updateDesc(body.description)
    }
    if ('assign' in body){
        if (typeof body.assign == "string"){
            let assign = []
            assign.push(body.assign)
            task.assignUsers(assign)
        }
        else{
            task.assignUsers(body.assign)
        }
    }
    if ('status' in body){
        task.updateStatus(body.status)
    }

    task.updateHistory(body.name)
    let obj = await collection.replaceOne(find,task)
    _closedb()
    if (obj.modifiedCount > 0) {
        return true
    } else {
        return false
    }
}

export async function removeItem(db,taskId){
    let collection = await _connectdb(db);
    let obj = await collection.deleteOne({'id': Number(taskId) })
    _closedb();
    if (obj.deletedCount > 0) {
        return true
    } else {
        return false
    }
}

export async function getUserDB(name,password){
    let collection = await _connectdb("users")
    let user = await collection.find({"name": name, "password": password}).toArray()
    let result = user.map(u => new User(u.name,u.password,u.taskLists))
    if (result.length == 0){
        return false
    }
    else{
        return result[0]
    }
}

export async function newTaskList(name,password,taskListId){
    let db = await _connect()
    //create task list
    let tasklist = await db.collection(taskListId)

    //check if list already exists
    let header = await tasklist.find({"id": "header"}).toArray()
    if (header.length == 0){
        console.log("new task list")
        header = new ListHeader()
        header.addUser(name)
        await tasklist.insertOne(header)
    }
    
    //update user
    let users = await db.collection("users")
    let user = await users.find({"name": name, "password": password}).toArray()
    let result = user.map(u => new User(u.name,u.password,u.taskLists))
    user = result[0]
    user.addTaskList(taskListId)
    let obj = await users.replaceOne({"name": name, "password": password},user)
    
    _closedb()
    return true
}

export async function inviteTaskList(user,taskListId){
    let collection = await _connectdb(taskListId)
    let find = {'id': "header"}
    let header = await collection.find(find).toArray()
    header = new ListHeader(header[0].users)
    header.addUser(user)

    let obj = await collection.replaceOne(find,header)
    _closedb()
    if (obj.modifiedCount > 0) {
        return 'User Added'
    } else {
        throw new Error(`User not added`)
    }
}
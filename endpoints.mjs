import {addItem,getItems,updateItem,removeItem,getUserDB,newTaskList,inviteTaskList} from './dbAdapter.mjs'
import {User,Task,ListHeader} from './appClasses.mjs'
import render from './templates.mjs'

export async function newUser(req,resp){
    let name = req.body.name
    let password = req.body.password
    let user = new User(name,password)

    await addItem("users",user)
    resp.status(201)
    resp.redirect("/user?name="+name+"&password="+password)
}

export async function getUser(req,resp){
    let name = req.query.name
    let password = req.query.password
    let user = await getUserDB(name,password)
    if(user){
        let tasklists = user.getTaskLists()
        let buttons = ""
        for (let id of tasklists){
            buttons += "<p><button formaction=/"+id+">"+id+"</button></p>"
        }
        let fields = {name: name, password: password, f_tasklists: buttons}
        let html = await render('user',{fill: fields})
        resp.send(html)
    }
    else{
        resp.status(404)
        resp.send("User not found")
    }
    
}

export async function getTaskLists(req,resp){
    let name = req.body.name
    let password = req.body.password
    let user = await getUserDB(name,password)
    if(user){
        resp.send(user.taskLists)
    }
    else{
        resp.status(404)
        resp.send("User not found")
    }
}

export async function createTaskList(req,resp){
    let name = req.body.name
    let password = req.body.password
    let listId = req.body.listId
    await newTaskList(name,password,listId)
    resp.redirect("/user?name="+name+"&password="+password)
}

export async function inviteUser(req,resp){
    let user = req.body.name
    let add = req.body.newUser
    let taskListId = req.params.listID
    await inviteTaskList(add,taskListId)
    resp.redirect("/"+taskListId+"?name="+user)
}

export async function getTasks(req,resp){
    let name = req.query.name
    let taskListId = req.params.listID
    if (req.query.page == "addtask"){
        let fields = { name: name, listId: taskListId}
        let html = await render('addtask',{fill: fields})
        resp.send(html)
    }
    else if (req.query.page == "grid"){
        let tasks = await getItems(taskListId)
        if(tasks.length != 0){
            let cards0 = ""
            let cards1 = ""
            let cards2 = ""

            for (let task of tasks){
                if (task.getId() != "header"){
                    let card = '<div class="card" id="'+task.getId()+'" draggable="true"><form method = "get"><input type="hidden" name="name" value="'+name+'"/><button formaction="'+taskListId+"/"+task.getId()+'">'+task.getName()+'</button></form></div>'
                    if (task.getStatus() == "0"){
                        cards0 += card
                    }
                    if (task.getStatus() == "1"){
                        cards1 += card
                    }
                    if (task.getStatus() == "2"){
                        cards2 += card
                    }
                }
            }

            let fields = { name: name, listId: taskListId, f_tasks0: cards0, f_tasks1: cards1, f_tasks2: cards2}
            let html = await render('grid',{fill: fields})
            resp.send(html)
        }
        else{
            resp.status(404)
            resp.send("Tasks Not found")
        }
    }
    else{
        let tasks = await getItems(taskListId)
        if(tasks.length != 0){
            let task_buttons = ""
            let members = ""
            let addtask = "hidden"

            for (let task of tasks){
                if (task.getId() == "header"){
                    var users = task.getUsers()
                    for (let m of users){
                        members += m + ", "
                        if (m == name){
                            addtask = ""
                        }
                    }
                    members = members.slice(0, -2)
                }
                else{
                    task_buttons += "<p><button formaction=/"+taskListId+"/"+task.getId()+">"+task.getName()+"</button></p>"
                }
            }

            let fields = { name: name, listId: taskListId, f_tasks: task_buttons, members: members, f_edit: addtask}
            let html = await render('tasklist',{fill: fields})
            resp.send(html)
        }
        else{
            resp.status(404)
            resp.send("Tasks Not found")
        }
    }
}

export async function getTask(req,resp){
    let user = req.query.name
    let taskListId = req.params.listID
    let taskId = req.params.task
    let items = await getItems(taskListId,taskId,true)
    let task = items[0]
    let header = items[1]
    let members = header.getUsers()


    if(items.length != 1){
        let f_assigned = ""
        let assigned = task.getAssigned()
        for (let a of assigned){
            f_assigned += a +", "
        }
        f_assigned = f_assigned.slice(0,-2)

        let member_buttons = ""
        for (let m of members){
            member_buttons += '<p><input type="checkbox" name="assign" value='+m+'>'+m+'</p>'
        }

        let status0 = ""
        let status1 = ""
        let status2 = ""
        let status = task.getStatus()
        if (status == "0"){
            status0 = "selected"
        }
        if (status == "1"){
            status1 = "selected"
        }
        if (status == "2"){
            status2 = "selected"
        }

        let fields = { name: user, taskname: task.getName(), description: task.getDesc(), assigned: f_assigned, listId: taskListId, taskId: taskId, f_members: member_buttons, status0: status0, status1: status1, status2: status2}
        let html = await render('task',{fill: fields})
        resp.send(html)
    }
    else{
        resp.status(404)
        resp.send("Task Not Found")
    }
}

export async function getHistory(req,resp){
    let user = req.query.name
    let taskListId = req.params.listID
    let taskId = req.params.task
    let date = req.params.date
    let task = await getItems(taskListId,taskId)
    task = task[0]
    task = task.getHistory(date)

    let f_assigned = ""
    let assigned = task.assigned
    for (let a of assigned){
        f_assigned += a +", "
    }
    f_assigned = f_assigned.slice(0,-2)

    let status0 = ""
        let status1 = ""
        let status2 = ""
        let status = task.status
        if (status == "0"){
            status0 = "selected"
        }
        if (status == "1"){
            status1 = "selected"
        }
        if (status == "2"){
            status2 = "selected"
        }

    let fields = { name: user, taskname: task.name, description: task.description, assigned: f_assigned, listId: taskListId, taskId: taskId, f_edit: "hidden", status0: status0, status1: status1, status2: status2}
    let html = await render('task',{fill: fields})
    resp.send(html)
}

export async function getHistories(req,resp){
    let user = req.query.name
    let taskListId = req.params.listID
    let taskId = req.params.task
    let task = await getItems(taskListId,taskId)
    task = task[0]
    let history = task.getHistory()
    let history_buttons = ""
    for (let h of history){
        let date = h.date
        let version_user = h.user
        history_buttons += "<p><button formaction=/"+taskListId+"/"+task.getId()+"/history/"+date+">"+date+" by: "+version_user+"</button></p>"
        
    }
    let fields = { name: user, f_history: history_buttons}
    let html = await render('history',{fill: fields})
    resp.send(html)
}

export async function newTask(req,resp){
    let user = req.body.name
    let taskListId = req.params.listID
    let body = req.body
    let id = Math.floor(Math.random() * 100000)
    let taskName = "New Task"
    let description = ""

    if ('name' in body && body.taskname != ''){
        taskName = body.taskname
    }

    if ('description' in body && body.description != ''){
        description = body.description
    }

    let task = new Task(id,taskName,description)
    task.updateHistory(user)
    await addItem(taskListId,task)
    resp.status(201)
    resp.redirect("/"+taskListId+"?name="+user)
}

export async function updateTask(req,resp){
    let user = req.body.name
    let taskListId = req.params.listID
    let taskId = req.params.task
    let body = req.body
    let result = await updateItem(taskListId, taskId, body)
    if (result){
        resp.redirect("/"+taskListId+"?name="+user)
    }
    else{
        resp.status(404)
        resp.send("Task not Found")
    }
}

export async function deleteTask(req,resp){
    console.log("deleting task")
    let user = req.body.name
    let taskListId = req.params.listID
    let taskId = req.params.task
    let result = await removeItem(taskListId,taskId)
    if (result){
        resp.redirect("/"+taskListId+"?name="+user)
    }
    else{
        resp.status(404)
        resp.send("Task not Found")
    }
}
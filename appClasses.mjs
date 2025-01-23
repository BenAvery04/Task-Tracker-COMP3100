import {getTime} from './time.mjs'

export class User{
    constructor(name,password,taskLists=[]){
        this.name = name
        this.password = password
        this.taskLists = taskLists
    }

    getName(){
        return this.name
    }
    getPassword(){
        return this.password
    }
    getTaskLists(){
        return this.taskLists
    }
    addTaskList(listId){
        this.taskLists.push(listId)
    }

}

export class Task{
    constructor(id,name,description,history={},assigned=[],status = "0"){
        this.id = id
        this.name = name
        this.description = description
        this.history = history
        this.assigned = assigned
        this.status = status
    }
    updateHistory(user){
        let prevState = {
            "name": this.name,
            "description": this.description,
            "assigned": [],
            "user": user,
            "status": this.status
            }
        for (let user of this.assigned){
            prevState.assigned.push(user)
        }
        let currTime = getTime()
        this.history[currTime] = prevState
    }

    getId(){
        return this.id
    }

    getName(){
        return this.name
    }
    getDesc(){
        return this.description
    }
    getHistory(date = null){
        if (date){
            return this.history[date]
        }
        else{
            let versions = []
            for (let date in this.history){
                date = String(date)
                let user = this.history[date].user
                let version = {
                    "date": date,
                    "user": user
                }
                versions.push(version)
            }
            return versions
        }
    }
    getAssigned(){
        return this.assigned
    }

    getStatus(){
        return this.status
    }

    updateName(newName){
        this.name = newName
    }

    updateDesc(newDesc){
        this.description = newDesc
    }

    assignUsers(users){
        this.assigned = users
    }

    updateStatus(status){
        this.status = status
    }
}

export class ListHeader{
    constructor(users=[]){
        this.id = "header"
        this.users = users
    }
    getId(){
        return this.id
    }
    getUsers(){
        return this.users
    }
    addUser(user){
        if(this.users.indexOf(user) == -1){
            this.users.push(user)
            return true
        }
        else{
            return false
        }
    }
    removeUser(user){
        let i = this.users.indexOf(user)
        if(i > -1){
            this.users.splice(i,1)
            return true
        }
        else{
            return false
        }
    }
}
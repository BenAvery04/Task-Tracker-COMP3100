/**
 * 
 * Modified E Brown F24
 **/ 

import express, { json, urlencoded } from 'express';
import render from './templates.mjs'
import {newUser,getUser,getTaskLists,createTaskList,inviteUser,getTasks,getTask,getHistory,getHistories,newTask,updateTask,deleteTask} from './endpoints.mjs'
const app = express();

app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));//incoming objects are strings or arrays

// resource and service routing
app.get('/', async (req,resp) => {
    let html = await render('home',{})
    resp.send(html)
});
app.post('/user',newUser) 
app.get('/user',getUser) 
//app.get('/user/taskLists',getTaskLists)
app.post('/user/taskLists',createTaskList)
app.post('/:listID/invite',inviteUser)
app.get('/:listID',getTasks)
app.get('/:listID/:task',getTask)
app.get('/:listID/:task/history',getHistories)
app.get('/:listID/:task/history/:date',getHistory)
app.post('/:listID',newTask)
app.post('/:listID/:task/update',updateTask)
app.post('/:listID/:task',deleteTask)


export default app // useful when started as a module

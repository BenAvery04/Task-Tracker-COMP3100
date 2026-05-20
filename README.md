## About

This is the project repo for COMP3100 F24 term project. The purpose of the project was to test familiarity with Javascript, HTTP requests, unit tests and usage of database APIs such as MongoDB. CSS and page ascetics were not tested and were not accounted for in the creation of the project. The Grid/Kanban view was a required feature of the project however was not properly implemented before the submission deadline. The code remains identical to what was submitted for the course project. Attributions are listed in attributions.md.  
## Demo  

Link to demo video:  
https://drive.google.com/file/d/1nei8HGOX9hN8aZ9CFROWy0e6gbOQNHBU/view?usp=sharing  

 ## How to run
In order to run the server you first need the express and mongodb modules.  
These can be installed with "npm install express" and "npm install mongodb"  

MongoDB must also be installed and set up. You can download the free community edition at:  
https://www.mongodb.com/products/self-managed/community-edition  

To run the server run serve.mjs with "node serve.mjs"  
A local host will then be provided.

Http requests can be tested using a browser or a program such as postman.  

All data is stored in a mongo database named "tasklist" 

 ## Layout
 All the necessary code files are included directly in the repo. Test related files are in the tests folder.

 ## Architecture
 `appClasses.mjs`: Includes all the classes required for the project  
 `endpoints.mjs`: Includes functions for app.mjs http requests and generates html pages for client  
 `dbAdapter.mjs`: Includes functions to interact with the mongo database  
 `time.mjs`: Includes getTime() to get system time  
 `app.mjs`: Includes express app and services for the app  
 `serve.mjs`: Runs the local app  
 `templates.mjs`: Wrapper for ejs template engine

 ## Features
 * Entering new tasks  
    HTTP call: POST /:listID  
    listID: the id of the list the task is to be 
    posted to  
      
    Body params:  
    "name" = Name of user adding the task  
    "taskname" = Name of the task  
    "description" = description of the task  
      
    To Enter a new task use POST /:listID with a body with user, name and description parameters. This will add the task to the database with the listID

    
 * Maintaining history of all tasks  
    HTTP call: GET /:listID/:task/history  
    listID: the id of the list the task is apart of  
    task: the id of the task

    To get a list off all changes use GET /:listID/:task/history. This will return a list of objects that include the date the change was made and who made the change.  

 * Requesting details of a specific task  
    HTTP call: GET /:listID/:task  
    listID: the id of the list the task is apart of  
    task: the id of the task  

    To get details of a specific task use GET /:listID/:task. This will return the task object with the task id provided  

 * Updating information of a particular task  
    HTTP call: POST /:listID/:task/update  
    listID: the id of the list the task is apart of  
    task: the id of the task  
      
    Body Params:  
    "name"= Name of the user updating the task  
    "taskname"= New name for the task (optional)  
    "description"= New description for the task (optional)  
    
    To update the information of a particular task use PUT /:listID/:task. The history will be updated with the provided user  

 * Retrieving the task details history  
    HTTP Call: GET /:listID/:task/history/:date  
    listID: the id of the list the task is apart of  
    task: the id of the task  
    date: the date of the history  

    To get the history at a particular date use GET /:listID/:task/history/:date. The date can be obtained from GET /:listID/:task/history  

 * Retrieving details of multiple tasks  
    HTTP Call: GET /:listID  
    listID: the id of the list the tasks are apart of  

    To get all the tasks in a task list use GET /:listID  

 * Creating User profiles  
   HTTP Call: POST /user  

   Body params:  
   "name"= Name of new user  
   "password"= Password of new user  

   To create a user and add it to the user database use POST /user with name and password in the body.  

 * Multiple Users logging on to a shared board  
    HTTP Call: POST /:listID/invite 
  
    Body params:  
    "name"=name of user adding new user
    "newUser"=name of user to add to task list  

    To add a user to a task list use POST /:listID/invite with name of the user you wish to add and the list id of the list you wish to add them to. While this does add their name to the lists header object, there are no checks currently if a user is in the list when accessing it.  

 * Task Assignment of users to different tasks  
   HTTP call: POST /:listID/:task/update  
    listID: the id of the list the task is apart of  
    task: the id of the task  
      
    Body Params:  
    "name"= Name of the user updating the task  
    "assign"= Name of user to assign to task (optional)   

    This feature uses the same call as updating task information and can be done at the same time.  

## Unit Tests

Unit tests can be ran using "node tests/test-app.mjs"  
The supertest module is required which can be installed using "npm install supertest"  
Mongo database needs to be manually cleared after tests. 

Checking Task History fails because since the task was updated immediately after it was created, not enough time has passed for the date to change and the previous version gets overwritten.  

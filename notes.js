// Dev Dependencies are those dependencies that are only useful during development phase.
// Once deployed it doesnt serve any purpose
// npm i --save-dev nodemon to install nodemon as a dev dependency


/*
    models -  How data will be structured in the database
    routes - API's will be written in this 
    controllers - All the functionality will be in here(The callback that is with the post/get method is controller)
    middlewares - Before the server handles our request this is where our request will go 
                  For ex :- Check if the user has the cookies to visit the website
    db - Connection with the database will be written here 
    utilies - THis is where the things of we will use a lot will be kept that are our utilities(Some functions that we will be using in a lot of files)
*/
/*
    A extention named prettier is added to have a proper spacing defined and other necessary features of writing code are defined 
    For this 
            -- Install prettier as a dev dependency 
            -- Then add a .prettierrc file in the project folder to add the constraints of writing code
*/

/*
Database is located far away and hence it would take time to get the data from the database so alwasys use async await
*/


/* ############################################## How to use routes and controller #####################################################
    
    $$              Example user.routes.js , user.controllers.js , app.js $$

    --First of all make a function that u want to get executed as a callback 
    --Then in the user.route make a route and export it 
    --Now impoort the router in app.js
    --Next thing that we have to understand is that we cant simply use app.get to call execute the api as router is exported
        --So now u would have to make a middleware that would hit the api/v1/user api and call the userRouter that we imported
        --This would in turn give control to the userRouter to hit the next desired router example /register 
            -- Url = http://localhost:8000/api/v1/users/register
        --Now inside the user.route we would use the route method in router to generate the post/get requests and pass the controller callback
            --router.router("/register").post(registerUser)


 */

/*  Aggregation pipelines
    
An aggregation pipeline consists of one or more stages that process documents:

Each stage performs an operation on the input documents. For example, a stage can filter documents, group documents, and calculate values.

The documents that are output from a stage are passed to the next stage.

*/
// Dev Dependencies are those dependencies that are only useful during development phase.
// Once deployed it doesnt serve any purpose
// npm i --save-dev nodemon to install nodemon as a dev dependency


/*
    models -  How data will be structured in the database
    routes - API's will be written in this 
    controllers - All the functionality will be in here
    middlewares - Before the server handles our request this is where our request will go 
                  For ex :- Check if the user has the cookies to visit the website
    db - Connection with the database will be written here 
    utilies - THis is where the things of we will use a lot will be kept that are our utilities
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
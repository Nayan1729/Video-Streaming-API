
// 1)  init(npm init) 
/*
    It is a utility that is that will help u how to create a package.json file
    Similarly create-react-app, vite are also utilities
*/

// 2)  Important data like database passwords and stuff are put in env files
//Also make sure to add the .env file in the .gitignore file to ignore the files mentioned in the .gitignore to not push on git
/*
To access these .env variable import dotenv and use it as a variable 
For example: PORT=3000 in .env file
    In the js file we will write this as process.env.PORT(process.env.VARIABLE_NAME)
    const port = process.env.PORT || 3000
*/


// 3) difference between commonjs and modulejs
/*
    ├── lib/ 
│ ├── module-exampleA.js (commonjs format) 
│ ├── module-exampleA.mjs (es6 module format) 
│ └── private/ 
│ ├── module-exampleB.js (commonjs format) 
│ └── module-exampleB.mjs (es6 module format) 
├── package.json 
└── … 

    In commonjs is loaded synchronous and the opposite is for module js is loaded asynchronous
    When in package.json we write "type" : "module" the server knows that it must collect on .mjs format files
*/

// 4) When connecting frontend with the backend and when both are running on different server sometimes u will get a CORS policy error 
/*
--- CORS policy is for the protection as any server gets loads of requests and to make sure it is from a valid user is a necessity.
    For that we have to whitelist that ip. we have to also whitelist urls to remove cors policy .  
--- 
    Proxies are used to standardize and simplify URL requests.
    Configure server to automatically append '/api' to requests.
    Proxy allows the server to know the origin of the request.
    Proxy is a solution to handle errors related to CORS.
--- in our backend we can also add cors package which will help remove this cors package 
--- very important
    We have to make standardization like app.get("/api/login") in the backend  and we add a proxy in the frontend as well
    (Refer at How to connect backend and frontend 36:00)
    Summary is that no matter where u are using your front end and backend it once u have added a proxy it will mean that the /api
    will make sure that the server feels that the request is from the same client 
    https://www.bannerbear.com/blog/what-is-a-cors-error-and-how-to-fix-it-3-ways/

    Whenever a website tries to make a cross-origin request, the browser will add these CORS headers to the request:

Origin
Access-Control-Request-Method
Access-Control-Request-Headers

The server will return a response with some of these CORS headers to allow or block the request:

Access-Control-Allow-Origin
Access-Control-Allow-Credentials
Access-Control-Expose-Headers
Access-Control-Max-Age
Access-Control-Allow-Methods
Access-Control-Allow-Headers

A CORS error occurs when the server doesn’t return the CORS headers required.


 Bad practice followed instead of segregating fronend and backend


 5) To run frontend and backend together we have to run both on different terminals and use the npm run build 
    Now a folder will be made and u have to folder and put it in the backend.
    This folder will be used to add static files in the backend

    SO basically people add only backend in the deployment app and put the react app in the backend after building it
*/

// 6) The first thing to do while making a backend project is 
/*
    Design the data model i.e how the application would look like and what it will contain 
    Firstly start with the registration page and make sure u have fixed what field u want in every page of your app.
    
*/
// Here in the utilities folder we make a function that we are going to use a lot and in almost every time we want to talk to the database 
/*
  Here in this file we will make a high order function
  That function will act as a wrapper.  
  Takes another function as argument
  function asyncHandler = (fn) =>{ ()=>{} }
*/
// const asyncHandler = (fn)=>{
//     async (req,res,next) =>{
//         try {
//             await fn(req,res,next);
//         } catch (error) {
//             res.status(err.code || 500 ).json({
//                 success  : false,
//                 messagse : err.messagse 
//             })
//         }
//     }
// }
//Another syntax for the same that include promise

const asyncHandler = (requestHandler)=>{
   return  (req,res,next)=>{ // This async handler function takes a function and returns a promise
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>{next(err)})
    }
}
export default asyncHandler;
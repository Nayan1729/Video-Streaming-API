/*
Doing all this really helps at the production level as this way we define what all we want at the time of error and what all should be passed
when we encounter an error.
*/

class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message); // To override the messagse
        this.statusCode = statusCode;
        this.data = null
        this.success = false
        this.message = message
        this.errors = errors
        if(stack){
            this.status = stack
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}
export default ApiError;
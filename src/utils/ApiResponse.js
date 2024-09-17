class ApiRespose {
    constructor(statusCode,data,messagse="Success"){
        this.messagse = messagse;
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode
 
    }
}
export default ApiRespose;
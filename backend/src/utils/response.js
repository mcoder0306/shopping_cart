const successResponse=(res,statusCode,message,data="Success")=>{
    res.status(statusCode).json({
        status:"success",
        message:message,
        data:data
    })
}

const errorResponse=(res,statusCode,message,error="Error")=>{
    res.status(statusCode).json({
        status:"error",
        message:message,
        error:error
    })
}

export {successResponse,errorResponse}
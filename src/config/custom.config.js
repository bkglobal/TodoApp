
// STATUS CODES USED FOR RESPONSE ..... 
module.exports.statusCode = {
    OK: 200,
    Internal_Server_Error: 500,
    Not_Found: 404,
    Forbidden: 403,
    Bad_Request: 400,
    Found: 302
}

/** Two todo list types personal for one user and collaborative for multiple users */
module.exports.TodoListTypes = {
    collaborativeList: 'collaborativeList',
    personalList: 'personalList',
}


module.exports.emailConfig = {
    mailthrough: 'no-reply@email.com',
}
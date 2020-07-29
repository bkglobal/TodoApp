const StatusCode = require('../config/custom.config').statusCode;
const Database = require('../database/Database');

class AuthMiddleware {

    // Check is user is verified or authentication token is avalaible on header..
    UserAuth (req, res, next) {
        const token = req.headers['authorization'];
        if(!token) return res.status(StatusCode.Forbidden).send({status: StatusCode.Forbidden, message: 'Unauthorized'});
        Database.findToken(token).then(user => {
            req.user = user;
            req.token = token;
            next();
        }).catch(error => {
            return res.status(StatusCode.Not_Found).send({status: StatusCode.Forbidden, message: 'Invalid Token'});
        })
    }
    
}
module.exports = new AuthMiddleware();


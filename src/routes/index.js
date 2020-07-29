var express = require('express');
var app = express.Router();
var UserRoute = require('./apis/user.api');
var TodoRoute = require('./apis/todo.api');
/* GET home page. */
app.use('/user', UserRoute);
app.use('/todo', TodoRoute);
module.exports = app;

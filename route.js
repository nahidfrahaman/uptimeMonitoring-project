/*
title : Route 
Description : application routes 
Author : nahid 
Date : 26-06-24
inspired by : sumit shaha
*/

// dependecies 
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler')
const {userHandler} = require('./handlers/routeHandlers/userHandler')
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler')
const {checkHandler} = require('./handlers/routeHandlers/checkHandler')


const routes  = {
    sample : sampleHandler,
    user : userHandler ,
    token : tokenHandler,
    check : checkHandler
}

module.exports = routes ;


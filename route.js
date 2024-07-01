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


const routes  = {
    sample : sampleHandler,
    user : userHandler 
}

module.exports = routes ;


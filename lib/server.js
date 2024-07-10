/*
title : Server file  
Description : Handle server related files
Author : nahid 
Date : 10-07-24
inspired by : sumit shaha
*/

// dependencis 
const http = require('http');
const {handleReqRes} = require('../helpers/handleReqRes')
const environment  = require('../helpers/environment')

// app object - module scaffolding 
const server = {};

server.createServer  = () => {
    const createServerVariable = http.createServer(server.handleRequest);
    createServerVariable.listen(environment.port, () => {
        console.log('listening port in' + environment.port);
        
    })
}

// handle req res
server.handleRequest = handleReqRes;

// run the server function 
server.init = () => {
    server.createServer()
}

// export module 
module.exports = server ;
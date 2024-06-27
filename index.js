/*
title : Uptime Monitoring Application 
Description : A restful API to monitor up or down user define links
Author : nahid 
Date : 26-06-24
inspired by : sumit shaha
*/

// dependencis 
const http = require('http');


const {handleReqRes} = require('./helpers/handleReqRes')


// app object - module scaffolding 
const app = {};

//configaration 
app.config = {
    port : 3000
}

// create Server 
app.createServer  = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(app.config.port, () => {
        console.log('listening port in ' + app.config.port);
        
    })
}

// handle req res
app.handleRequest = handleReqRes

// run the server function 
app.createServer();
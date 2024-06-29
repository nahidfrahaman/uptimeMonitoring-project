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
const environment  = require('./helpers/environment')
const data = require('./lib/data')

// app object - module scaffolding 
const app = {};

// for testing perpose 
data.create('test','textnahid', {mygf: 'sanjida', loved : 'yes'} , (err)=> {
     if(err) {
        console.log('error was : ' , err);
        
}})

// create Server 
app.createServer  = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(environment.port, () => {
        console.log('listening port in' + environment.port);
        
    })
}

// handle req res
app.handleRequest = handleReqRes

// run the server function 
app.createServer();
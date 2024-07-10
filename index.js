/*
title : project initial file 
Description : Handle start the server and worker 
Author : nahid 
Date : 26-06-24
inspired by : sumit shaha
*/

// dependencis 
const server = require('./lib/server')
const workers = require('./lib/worker')

// app object - module scaffolding 
const app = {};


app.init = () => {
    // start the server 
    server.init();

    // start the workers
    workers.init() ;
}

app.init()

// module export 
module.exports = app ;
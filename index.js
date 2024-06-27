/*
title : Uptime Monitoring Application 
Description : A restful API to monitor up or down user define links
Author : nahid 
Date : 26-06-24
inspired by : sumit shaha
*/

// dependencis 
const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder') ;


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
app.handleRequest = (req, res) => {
    // requrest handling 
    // get the url and parse it 
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const tirmedPath = path.replace(/^\/|\/+$/g,'')
    console.log(tirmedPath);
    
    // get method   // get method     // get header 
    const method = req.method.toLowerCase();
    const queryObject = parsedUrl.query ;
    const headersObject = req.headers;
  
    // req body handle 
    const decoder = new StringDecoder('utf-8')
    let realdata = "";


    req.on('data', (buffer) => {
        realdata += decoder.write(buffer)
    })

    req.on('end', () => {
        realdata += decoder.end();
        console.log(realdata);
        res.end('hello programer')
    })

    // response handle 
   
}

// run the server function 
app.createServer();
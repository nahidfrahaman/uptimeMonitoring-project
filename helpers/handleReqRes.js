/*
title : handle Request and response 
Description : A restful API to monitor up or down user define links
Author : nahid 
Date : 26-06-24
inspired by : sumit shaha
*/

//dependence 
const {StringDecoder} = require('string_decoder') ;
const url = require('url');
const routes = require('../route')
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler')
// module scaffolding 
const handler = {};


handler.handleReqRes =  (req, res) => {
    // requrest handling 
    // get the url and parse it 
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const tirmedPath = path.replace(/^\/|\/+$/g,'')
    
    
    // get method   // get method     // get header 
    const method = req.method.toLowerCase();
    const queryObject = parsedUrl.query ;
    const headersObject = req.headers;
  
    const requestProperty  = {
        parsedUrl,
        path,
        tirmedPath, 
        method,
        queryObject,
        headersObject
    }


    // req body handle 
    const decoder = new StringDecoder('utf-8')
    let realdata = "";

    const chosenHandler = routes[tirmedPath] ? routes[tirmedPath] : notFoundHandler;
    
    
    req.on('data', (buffer) => {
        realdata += decoder.write(buffer)
    })

    req.on('end', () => {
        realdata += decoder.end();

        chosenHandler(requestProperty, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500 ;
            payload = typeof(payload) === 'object' ? payload : {} ;
    
            const payloadSting = JSON.stringify(payload);
    
            // return final response 
            res.writeHead(statusCode);
            res.end(payloadSting);
        })
    
       
    })

    // response handle 
   
}

module.exports = handler;
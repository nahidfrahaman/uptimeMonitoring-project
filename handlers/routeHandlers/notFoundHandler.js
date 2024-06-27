/*
title : Not Found Handler 
Description : 404 not found handler 
Author : nahid 
Date : 26-06-24
inspired by : sumit shaha
*/
// module scaffolding ;
const handler = {}

handler.notFoundHandler = (requestProperty, callback) =>  {
    console.log('Not Found');
    callback(404, {
        message : 'Your requested url not Found'
    })
    
}

module.exports = handler;
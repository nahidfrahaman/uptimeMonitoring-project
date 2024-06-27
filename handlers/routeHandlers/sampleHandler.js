/*
title : Sample Handler 
Description : handle routes for sample 
Author : nahid 
Date : 26-06-24
inspired by : sumit shaha
*/
// module scaffolding ;
const handler = {}

handler.sampleHandler = (requestProperty, callback) =>  {
    // console.log('sample handler');

    callback(200, {
        message : 'This is a sample route'
    })
    
}

module.exports = handler;
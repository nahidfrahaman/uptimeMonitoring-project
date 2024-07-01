/*
title : utitlies
Description : Handle to utilites function 
Author : nahid 
Date : 27-06-24
inspired by : sumit shaha
*/

// dependencis 
const environments = require('./environment');
const { createHmac } = require('node:crypto');

// module scaffolding
const utilities  = {};


utilities.parseJSON = (jsonStirng) => {
   let output;
   try {
    output = JSON.parse(jsonStirng);
   } catch {
    output = {};
   }
   return output ;
}

utilities.hash =(str) => {
   if(typeof str === 'string' && str.length > 0 ) {
      console.log(environments, process.env.NODE_ENV);
      
      const hash = createHmac('sha256', environments.secretKey)
               .update(str)
               .digest('hex');
      console.log(hash) ;
      
      return hash ; 
   }
}

module.exports = utilities ;
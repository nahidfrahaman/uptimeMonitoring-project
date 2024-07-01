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
      const hash = createHmac('sha256', environments.secretKey)
               .update(str)
               .digest('hex');
      return hash ; 
   }
}

utilities.randomString = (stringLength) => {
  
   if(typeof stringLength === 'number' && stringLength >= 20) {
      
      
      const randomString = 'abcdefghijklmnopqrstuvwxyz'
      let output = '';
      for(let i = 0 ; i < stringLength ; ++i) {
         const genreatedRandomString = randomString.charAt(Math.random() * stringLength)
         output += genreatedRandomString ;
      }
      return output ;
   }
  
   
}

module.exports = utilities ;
/*
title : envrionment
Description : Handle environment variable 
Author : nahid 
Date : 27-06-24
inspired by : sumit shaha
*/

// module scaffolding 

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey : 'hanoihganoaino',
    twilio : {
        fromPhone : '',
        accountSid : '',
        authToken : ''
    }
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey : 'nbaoioappomao',
    twilio : {
        fromPhone : '',
        accountSid : '',
        authToken : ''
    }
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';


    
// export corresponding environment object

const environmentToExport =
    typeof environments[currentEnvironment.trim()] === 'object'
        ? environments[currentEnvironment.trim()]
        : environments.staging;

// export module


module.exports = environmentToExport;
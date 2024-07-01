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
    secretKey : 'hanoihganoaino'
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey : 'nbaoioappomao'
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

    console.log('Current Environment:', currentEnvironment )// outpur : production
    
// export corresponding environment object
console.log(environments[currentEnvironment.trim()] ); // output : undefine why ??

const environmentToExport =
    typeof environments[currentEnvironment.trim()] === 'object'
        ? environments[currentEnvironment.trim()]
        : environments.staging;

// export module
console.log(environmentToExport); // why ? 

module.exports = environmentToExport;
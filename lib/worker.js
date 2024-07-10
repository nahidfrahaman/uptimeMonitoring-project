/*
title : worker file  
Description : Handle worker  related files
Author : nahid 
Date : 10-07-24
inspired by : sumit shaha
*/
//dependencis 
const lib = require('./data')
const {parseJSON} = require('../helpers/utilities');
const url = require('url')
const {sendTwilioSms} = require('../helpers/notification')
const http = require('http');
const https = require('https')

// app object - module scaffolding 
const workers = {};

// gather all checks function 
workers.gatherAllChecks = () => {
// get the all checks 
  lib.list('checks', (err , checks) => {
    if(!err && checks && checks.length > 0 ) {
        checks.forEach((check)=> {
            // read the check file 
            lib.read('checks', check , (err , originalCheckData) => {
                if(!err && originalCheckData) {
                    // pass the data to the check validator 
                    workers.checkValidator(parseJSON(originalCheckData))
                } else {
                    console.log('Error: reading one of the checks data!')
                }
            })
        })
    } else {
        console.log('could not find any checks in this process :' , err);
        
    }
  })
    

}
// checks validate , state , last check add
workers.checkValidator = (originalCheckData) => {
    if(originalCheckData && originalCheckData.id) {
        // add state property to the original data 
        originalCheckData.state = typeof originalCheckData.state === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down' ;

        // add last check 
        originalCheckData.lastCheck = typeof originalCheckData.lastCheck === 'number' && originalCheckData.lastCheck > 0 ? originalCheckData.lastCheck : false ;

        // pass to the woker perform the main req response function 

        workers.checksPerform(originalCheckData)

    } else {
        console.log('Error: check was not properly formated');
        
    }
}
// check perfrom , sent req in user url 
workers.checksPerform = (originalCheckData) => {

    //prepare the initial outcome 
    let checkOutCome = {
        error  : false ,
        responseCode : false
    }
    // checking outcome isSent ?
    let outComeSent = false ;
    // parse the hostname and full url from data 

    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}` , true);
    const hostName = parsedUrl.hostname;
    const path = parsedUrl.path;

    // construct the request 
    const requestDetails = {
       'protocol' : `${originalCheckData.protocol}:`,
       'hostname' : hostName ,
       'method' : originalCheckData.method.toUpperCase(),
       path,
       timeout : originalCheckData.timeoutSeconds * 1000
    };

    const protocolToUse = originalCheckData.protocol === "http" ? http : https;

    // intantiate the request object 
    const req = protocolToUse.request(requestDetails, (res) => {
        // grab the request statue
        const status = res.statusCode ;

        // update the check outcome and pass to the next process
        if(!outComeSent) {
            checkOutCome.responseCode = status ;
            // passe the next function
            workers.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })

    // req error event 
    req.on('error' ,(err) => {
        checkOutCome = {
            error : true,
            value : err , 
        }
        if(!outComeSent) {
            // passe the next function
            workers.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })

    // lookup the timeout request 
    req.on('timeout' , () => {
        checkOutCome = {
            error : true,
            value : 'timeout', 
        }
        if(!outComeSent) {
            // passe the next function
            workers.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })

    req.end()

}

// process checkout according req outcome status
workers.processCheckOutCome = (originalCheckData, checkOutCome) => {
    // check if the checkoutCome up and down 
    const state = !checkOutCome.error && checkOutCome.responseCode && originalCheckData.successCode.indexOf(checkOutCome.responseCode) > -1 ? 'up' : 'down';

     // decide whether we should alert the user or not

    const weWantToAlert = originalCheckData.lastCheck && originalCheckData.state !== state ? true : false ;

    // updae the original check data 
    originalCheckData.state = state;
    originalCheckData.lastCheck = Date.now();

    // update the check data to database or file 
    lib.update('checks', originalCheckData.id, originalCheckData, (err) => {
        if(!err ) {
            if(weWantToAlert) {
                // pass to the next function that allert the user
                workers.toNotifyTheUser(originalCheckData) ;
            } else {
                console.log('Alert is not needed as there is no state change!');
            }
        } else {
            console.log('Error trying to save check data of one of the checks!');
        }
    })
}

workers.toNotifyTheUser = (originalCheckData) => {
   const msg = `Alert: Your check for ${originalCheckData.method.toUpperCase()} ${
    originalCheckData.protocol
    }://${originalCheckData.url} is currently ${originalCheckData.state}`;


    // send twilo sms 
    sendTwilioSms(originalCheckData.userPhone, msg , (err) => {
        console.log('error from twilo : ' , err);
        
        if(!err) {
            console.log(`User was alerted to a status change via SMS: ${msg}`);
        } else {
            console.log('error from twilo : ' , err);
            console.log('There was a problem sending sms to one of the user!');
        }
    })

}
// loops the worker checks continue 

workers.loops = () => {
    setInterval(() => {
        workers.gatherAllChecks();
    },  10000);
}

// run the server function 
workers.init = () => {
    // excute gather the all check
    workers.gatherAllChecks() ;

    // call the loop that checks continue after every 5 seconds
    workers.loops() ;
    
}

// export module 
module.exports = workers
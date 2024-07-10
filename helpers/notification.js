
/*
title :  twilio sms  
Description : handle twilo notification test 
Author : nahid 
Date : 29-06-24
inspired by : sumit shaha
*/


//dependencis 

const https = require('https');
const querystring = require('querystring');
const  {twilio} = require('./environment')

// module scaffolding
const notification = {};

// send sms Twilio function 
notification.sendTwilioSms = (phone, msg, callback) => {
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg = typeof msg === 'string' && msg.trim().length < 1600 && msg.trim().length > 0 ? msg.trim() : false;

    if (userPhone && userMsg) {
        // configure the request payload 
        const payload = {
            To: `+88${userPhone}`,
            From: twilio.fromPhone,
            Body: userMsg,    
        };

        // stringify payload to URL-encoded format
        const stringifiedPayload = querystring.stringify(payload);

        // configure the request details 
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                
            }
        };

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status code of the sent request 
            const status = res.statusCode;
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(status, {
                    errorMessage: `Status code returned was ${status}`
                });
            }
        });

        req.on('error', (err) => {
            console.log('Error from on req', err);
            callback(`Error occurred: ${err}`);
        });

        // send request 
        req.write(stringifiedPayload);
        req.end();
    } else {
        callback(400, {
            errorMessage: 'Input parameters are invalid'
        });
    }
};

module.exports = notification; 
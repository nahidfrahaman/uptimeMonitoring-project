/*
title : User Handler 
Description : handle routes to handle user routes
Author : nahid 
Date : 29-06-24
inspired by : sumit shaha
*/
// dependencies
const lib = require('../../lib/data');
const utilities = require('../../helpers/utilities');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const {_token} = require('./tokenHandler')



// module scaffolding ;
const handler = {}

handler.userHandler = (requestProperty, callback) =>  {
    const acceptedMethod = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

    if(acceptedMethod.indexOf(requestProperty.method) > -1) {
        // accepted method area 
        handler._user[requestProperty.method](requestProperty, callback) ;
    } else {
        callback(405)
    }   
}


handler._user = {}

handler._user.post = (requestProperty, callback) => {
    const firstName = typeof requestProperty.body.firstName === 'string' && requestProperty.body.firstName.trim().length > 0 ? requestProperty.body.firstName : false ;
    const lastName = typeof requestProperty.body.lastName === 'string' && requestProperty.body.lastName.trim().length > 0 ? requestProperty.body.lastName : false ;
    
    const phone = typeof requestProperty.body.phone === 'string' && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false ;
    
    const password= typeof requestProperty.body.password=== 'string' && requestProperty.body.firstName.trim().length > 0 ? requestProperty.body.password: false ;
    
    const toAgrement= typeof requestProperty.body.toAgrement=== 'boolean' ? requestProperty.body.toAgrement: false ;
  
    
    if(firstName && lastName && phone && password && toAgrement) {
        // make sure user does not exist 
        lib.read('user', phone, (err) => {
            if(err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password : utilities.hash(password), 
                    toAgrement
                }
                lib.create('user', phone , userObject , (err) => {
                    if(!err) {
                        callback(200, {
                            message : 'user created successfuly'
                        })
                    } else {
                        callback(500 , {
                            message : 'user not created'
                        })
                    }
                })
            } else {
                callback(500, {
                    message : 'error from server Side '
                })
            }
        })
    } else {
        callback(405, 'please input right inputs') 
    }
    
}


handler._user.get = (requestProperty, callback) => {

    const phone = typeof requestProperty.queryObject.phone === 'string' && requestProperty.queryObject.phone.length === 11 ? requestProperty.queryObject.phone : false ;
   

    if(phone ) {
        // Authentication
         _token.verify(requestProperty.headersObject.token , phone, (token) => {
            if(token){
                console.log(token); 
                lib.read('user', phone , (err, u)=> {
                    const user = {...parseJSON(u)}
                    delete user.password
                     
                    if(!err && u) {
                        callback(200, {
                            data : user 
                        })
                    } else {
                        callback(404 , {
                            message : 'user not found'
                        })
                    }
                })
            } else {
                callback(404, {
                    errorMessage : "Token is not valid"
                })
            }
         })
        // lock up the user 
    } else {
        callback(404, 'have problem in your request')
    }
    
}



handler._user.put = (requestProperty, callback) => {
    const phone = typeof requestProperty.queryObject.phone === 'string' && requestProperty.queryObject.phone.length === 11 ? requestProperty.queryObject.phone : false ;

    
    
    const firstName = typeof requestProperty.body.firstName === 'string' && requestProperty.body.firstName.trim().length > 0 ? requestProperty.body.firstName : false ;

    const lastName = typeof requestProperty.body.lastName === 'string' && requestProperty.body.lastName.trim().length > 0 ? requestProperty.body.lastName : false ;
  
    const password= typeof requestProperty.body.password=== 'string' && requestProperty.body.firstName.trim().length > 0 ? requestProperty.body.password: false ;



    if(phone) {
        // Athentication
       _token.verify(requestProperty.headersObject?.token , phone , (token) =>{
        if(token) {
            console.log(token);
            
            if(firstName || lastName || password) {

                // lock up the user 
                lib.read('user', phone, (err, u) => {
                 const userData = {...parseJSON(u)};
              
                 
                 if(!err && userData) {
                     if(firstName) {
                         userData.firstName = firstName;
                     }
                     if(lastName) {
                         userData.lastName = lastName;
                     }
                     if(password) {
                         userData.password = hash(password) ;
                     }
     
                     // update the file 
     
                     lib.update('user', phone, userData  ,(err) => {
                         if(!err) {
                             callback(200, {
                                 message : 'user was updated successfuly'
                             })
                         } else {
                             callback(400, {
                                 errorMessage : "There was problem in server side"
                             })
                         }
                     })
                 } else {
                     callback(404, {
                         errorMessage : 'Requested user not found  naika'
                     })
                 }
             })
     
            } else {
             callback(400, {
                 errorMessage: "You have a problem in your request kecui nai"
             })
            }
        } else {
            callback(404, {
                errorMessage : 'Token is not valid'
            })
        }
       })
    } else {
        callback(404, {
            errorMessage : 'You have problem in your request '
        })
    }

}



handler._user.delete = (requestProperty, callback) => {
    const phone = typeof requestProperty.queryObject.phone === 'string' && requestProperty.queryObject.phone.length === 11 ? requestProperty.queryObject.phone : false ;
  

    if(phone) {
        //Atuthentication
        _token.verify(requestProperty.headersObject?.token , phone , (token) =>{ 
            if(token) {
                lib.read('user', phone , (err, userData)=> {
                    if(!err && userData) {
                        lib.delete('user', phone, (err) => {
                            if(!err) {
                                callback(200, {
                                    message : 'user was deleted successfuly'
                                })
                            } else {
                                callback(400, {
                                    message : 'user not deleted server side error'
                                })
                            }
                        })
                    } else {
                        callback(500, {
                            errorMessage : 'ServerSide problem '
                        })
                    }
                })
            } else {
                callback(500, {
                    errorMessage : 'Invalid Token'
                })
            }
        })
    } else {
        callback(400,{
            errorMessage : 'You have problem in request'
        })
    }
} 

handler._user.patch = (requestProperty,callback) => {
    const phone = typeof requestProperty.queryObject.phone === 'string' && requestProperty.queryObject.phone.length === 11 ? requestProperty.queryObject.phone : false ;


    const changedPhone = typeof requestProperty.body.phone === 'string' && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false ;

    if(phone && changedPhone) {
        lib.changeFileName('user', phone, changedPhone, ()=> {
            
            
            if(!err) {
                callback(200, {
                    message : 'user phone changed successfuly'
                })
            } else {
                callback(500, {
                    errorMessage : 'server Side error'
                })
            }
        })
    } else {
        callback(400 , {
            errorMessage : 'you have problem in your request'
        })
    }
}

module.exports = handler;
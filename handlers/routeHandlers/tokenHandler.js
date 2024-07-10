/*
title : User Handler 
Description : handle routes to handle user routes
Author : nahid 
Date : 29-06-24
inspired by : sumit shaha
*/
// dependencies
const { hash, parseJSON ,randomString} = require('../../helpers/utilities');
const lib = require('../../lib/data');
// const utilities = require('../../helpers/utilities');
// const {hash} = require('../../helpers/utilities');
// const {parseJSON} = require('../../helpers/utilities');



// module scaffolding ;
const handler = {}

handler.tokenHandler = (requestProperty, callback) =>  {
    const acceptedMethod = ['get', 'post', 'put', 'delete',]

    if(acceptedMethod.indexOf(requestProperty.method) > -1) {
        // accepted method area 
        handler._token[requestProperty.method](requestProperty, callback) ;
    } else {
        callback(405)
    }   
}

handler._token = {}

handler._token.post = (requestProperty, callback) => {
    const phone = typeof requestProperty.body.phone === 'string' && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false ;
    
    const password= typeof requestProperty.body.password=== 'string' && requestProperty.body.password.trim().length > 0 ? requestProperty.body.password: false ;

    if(phone && password) {
        lib.read('user', phone , (err, userData)=> {
            if(!err && userData) {
            const hashedPassword = hash(password);
            if(hashedPassword === parseJSON(userData).password) {
                // create token 
                const tokenId = randomString(20)
            
                
                const expires = new Date() *60 *60 *1000 ;
                const tokenObj = {
                    phone, 
                    'id' : tokenId,
                    expires 
                }
            lib.create('tokens', tokenId, tokenObj, (err)=> {
                if(!err) {
                    callback(200, tokenObj)
                } else {
                    callback(500, {
                        errorMessage : "server side error token not saved"
                    })
                }
            })


            } else {
                callback(500, {
                    errorMessage : "server side error"
                })
            }
            } else {
                callback(500, {
                    errorMessage : 'Server side error user not found'
                })
            }
        })
    } else {
        callback(400, {
            errorMessage : 'You have problem in request'
        })
    }
} 

handler._token.get = (requestProperty, callback) => {
    const id = typeof requestProperty.queryObject.id === 'string' && requestProperty.queryObject.id.length === 20 ? requestProperty.queryObject.id : false ;
   

    if(id ) {
        // lock up the user 
        lib.read('tokens', id , (err, userToken)=> {
            const token = {...parseJSON(userToken)}
            
            if(!err && token) {
                callback(200, {
                    data : token
                })
            } else {
                callback(404 , {
                    message : 'token not found'
                })
            }
        })
    } else {
        callback(404,{
            errorMessage : 'token is invalid'
        })
    }
    
}

handler._token.put = (requestProperty, callback) => {
    const id = typeof requestProperty.body.id === 'string' && requestProperty.body.id.trim().length === 20 ? requestProperty.body.id : false ;
    
    const extend = typeof requestProperty.body.extend === 'boolean' && requestProperty.body.extend === true ? true : false ;

    if(id && extend) {
        lib.read('tokens', id , (err, tokenData) => {
            const tokenObj = parseJSON(tokenData);
            if(!err && tokenObj) {
                if(tokenObj.expires > Date.now()){
                    tokenObj.expires = Date.now() * 60 *60*1000 ; 
                    lib.update('tokens', id , tokenObj, (err)=> {
                        if(!err) {
                            callback(200, tokenObj)
                        } else {
                            callback(500,{
                                errorMessage : 'Server side error token not updated'
                            })
                        }
                    } )
                } else {
                    callback(404,{
                        errorMessage : 'token is already expired'
                    })
                }
            } else {
                callback(500,{
                    errorMessage : 'Server Side error '
                })
            }
        })

    } else  {
        callback(404,{
            errorMessage : 'You have problem in your reeques'
        })
    }
}


handler._token.delete = (requestProperty, callback) => {
    const id = typeof requestProperty.queryObject.id === 'string' && requestProperty.queryObject.id.length === 20 ? requestProperty.queryObject.id : false ;
  

    if(id) {
        // lockup the  token file
        lib.read('tokens', id , (err, tokenData)=> {
            if(!err && tokenData) {
                lib.delete('tokens', id, (err) => {
                    if(!err) {
                        callback(200, {
                            message : 'token was deleted successfuly'
                        })
                    } else {
                        callback(400, {
                            message : 'token not deleted server side error'
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
        callback(400,{
            errorMessage : 'You have problem in request'
        })
    }
} 

handler._token.verify = (id, phone , callback) => {
    lib.read('tokens', id ,(err, tokenData) => {
        const tokenObj = parseJSON(tokenData) ;
        if(!err && tokenData) {
            if(phone === tokenObj.phone) {
                callback(true);
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })

}

module.exports = handler;
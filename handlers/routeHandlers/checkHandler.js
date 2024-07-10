/*
title :check Handler 
Description : handle routes to handlecheck routes
Author : nahid 
Date :02-07-24
inspired by : sumit shaha
*/
// dependencies
// const { hash, parseJSON ,randomString} = require('../../helpers/utilities');
// const lib = require('../../lib/data');
// const utilities = require('../../helpers/utilities');
// const {hash} = require('../../helpers/utilities');
// const {parseJSON} = require('../../helpers/utilities');

const { parseJSON, randomString } = require("../../helpers/utilities");
const lib = require("../../lib/data");
const { _token } = require("./tokenHandler");



// module scaffolding ;
const handler = {}

handler.checkHandler = (requestProperty, callback) =>  {
    const acceptedMethod = ['get', 'post', 'put', 'delete',]

    if(acceptedMethod.indexOf(requestProperty.method) > -1) {
        // accepted method area 
        handler._check[requestProperty.method](requestProperty, callback) ;
    } else {
        callback(405)
    }   
}

handler._check = {}

handler._check.post = (requestProperty, callback) => {
    // checking inputs
    const protocol = typeof requestProperty.body.protocol === 'string' && ['http','https'].indexOf(requestProperty.body.protocol) > -1 ? requestProperty.body.protocol : false ;

    const url = typeof requestProperty.body.url === 'string' && requestProperty.body?.url.trim().length > 0 ? requestProperty.body.url : false ;

    const method = typeof requestProperty.body.method === 'string' && ['get', 'post', 'put', 'delete'].indexOf(requestProperty.body.method) > -1 ? requestProperty.body.method : false ;

    const successCode = typeof requestProperty.body.successCode === 'object' && Array.isArray(requestProperty.body.successCode) === true ? requestProperty.body.successCode : fasle ;

    
    

    const timeoutSeconds = typeof requestProperty.body.timeoutSeconds === 'number' && requestProperty.body.timeoutSeconds % 1 === 0 && requestProperty.body.timeoutSeconds >= 1 && requestProperty.body.timeoutSeconds <= 5 ? requestProperty.body.timeoutSeconds : false ;

    if(protocol && url && method && successCode && timeoutSeconds ) {
        const token = typeof requestProperty.headersObject.token === 'string' && requestProperty.headersObject.token.trim().length >=20 ? requestProperty.headersObject.token : false ;

        if(token) {
           // look up the user phone by reading token 
            lib.read('tokens', token, (err, tokendata) => {
                if(!err && tokendata) {
                    const userPhone = parseJSON(tokendata).phone ;
                   

                  // lookup the use 
                  lib.read('user', userPhone, (err, userData) => {
                    if(!err , userData) {
                        const userObject = parseJSON(userData);
                        // token verify
                        _token.verify(token, userObject.phone , (tokeIsValid) => {
                            if(tokeIsValid) {
                             // check have check property into userobject  if not , assign empty array 
                              const usercheck = typeof userObject.check === 'object' && Array.isArray(userObject.check) === true ? userObject.check : [] ; 

                              if(usercheck.length < 5 ) {
                                const checkId = randomString(20);
                                const checkObj = {
                                    id : checkId,
                                    userPhone ,
                                    protocol,
                                    url ,
                                    method,
                                    successCode,
                                    timeoutSeconds
                                }
                                // save the obj data file ,
                                lib.create('checks', checkId, checkObj,(err) => {
                                    if(!err) {
                                        // add check id into user object 
                                        userObject.check = usercheck ;
                                        userObject.check.push(checkId)

                                        // save or update user data ,

                                        lib.update('user',userPhone, userObject,(err) => {
                                            if(!err) {
                                                callback(200, {
                                                    userObject 
                                                })
                                            } else {
                                                callback(401, {
                                                    errorMessage: 'there is error in server side ',
                                                });
                                            }
                                        })
                                    } else {
                                        callback(500, {
                                            errorMessage: 'server error !',
                                        });
                                    }
                                })
                                

                              } else {
                                callback(401, {
                                    errorMessage: 'Userhas already reached max check limit!',
                                });
                              }


                            } else {
                                callback(403, {
                                    errorMessage: 'token is invalid!',
                                });
                            }
                        })
                    } else {
                        callback(403, {
                            errorMessage: 'user not found!',
                        });
                    }
                  })
                    
                } else {
                    callback(403, {
                        errorMessage: 'Authentication problem!',
                    }); 
                }
            })
        } else {
            callback(404, {
                errorMessage : "token is not given "
            })
        }




    } else {
        callback(404, {
            errorMessage : "You have problem in your request"
        })
    }

    

} 

handler._check.get = (requestProperty, callback) => {
    const id = typeof requestProperty.queryObject.id === 'string' && requestProperty.queryObject.id.length === 20 ? requestProperty.queryObject.id : false ;

    if(id) {
      const token = typeof requestProperty.headersObject.token === 'string' && requestProperty.headersObject.token.trim().length >=20 ? requestProperty.headersObject.token : false ;
        if(token) {
            // lock up the check 
            lib.read('checks', id, (err, ckData) => {
                const checksData = parseJSON(ckData)
                if(!err && checksData) {
                    // verify token 
                    _token.verify(token, checksData.userPhone, (tokenIsValid) => {
                        if(tokenIsValid) {
                            callback(200, checksData)
                        } else {
                            callback(404, {
                                errorMessage : "Invalid Token"
                            })
                        }
                    } )
                } else {
                    callback(500, {
                        errorMessage : "Server Side problem"
                    })
                }
            })
        } else {
            callback(404, {
                errorMessage : "Token is not found "
            })
        }
    } else {
        callback(404, {
            errorMessage : "You have problem in your request"
        })
    }
    
}

handler._check.put = (requestProperty, callback) => {
    const id = typeof requestProperty.body.id === 'string' && requestProperty.body.id.trim().length === 20 ? requestProperty.body.id : false ; 

    const protocol = typeof requestProperty.body.protocol === 'string' && ['http','https'].indexOf(requestProperty.body.protocol) > -1 ? requestProperty.body.protocol : false ;

    const url = typeof requestProperty.body.url === 'string' && requestProperty.body?.url.trim().length > 0 ? requestProperty.body.url : false ;

    const method = typeof requestProperty.body.method === 'string' && ['get', 'post', 'put', 'delete'].indexOf(requestProperty.body.method) > -1 ? requestProperty.body.method : false ;

    const successCode = typeof requestProperty.body.successCode === 'object' && Array.isArray(requestProperty.body.successCode) === true ? requestProperty.body.successCode : false ;

    const timeoutSeconds = typeof requestProperty.body.timeoutSeconds === 'number' && requestProperty.body.timeoutSeconds % 1 === 0 && requestProperty.body.timeoutSeconds >= 1 && requestProperty.body.timeoutSeconds <= 5 ? requestProperty.body.timeoutSeconds : false ;

    if(id) {
        const token = typeof requestProperty.headersObject.token === 'string' && requestProperty.headersObject.token.trim().length >=20 ? requestProperty.headersObject.token : false ;

      if(protocol || url || method || successCode || timeoutSeconds ) {
        if(token) { 
            // lock up the token for getting phone number 
            lib.read('tokens', token , (err, tokenData) => {
                if(!err && tokenData) {
                    const { phone }= parseJSON(tokenData);
                    // lock up the user 
                    lib.read('user', phone, (err , userData) => {
                        const userObj = parseJSON(userData);
                        if(!err && userData) {
                            // verify token 
                            _token.verify(token, userObj.phone, (tokenIsValid) => {
                                if(tokenIsValid){
                                    // check have check property into userobject  if not , assign empty array 
                                lib.read('checks', id , (err ,  checksData) => {
                                    const checksObj = parseJSON(checksData) ;
                                    if(!err && checksObj) {
                                        if(protocol) {
                                            checksObj.protocol = protocol ;
                                        }
                                        if(url) {
                                            checksObj.url = url ;
                                        }
                                        if(method) {
                                            checksObj.method = method ;
                                        }
                                        if(timeoutSeconds) {
                                            checksObj.timeoutSeconds = timeoutSeconds ;
                                        }

                                        // update checks data 
                                        lib.update('checks', checksObj.id , checksObj , (err) => {
                                            if(!err) {
                                                callback(200, {
                                                    message : 'update successfuly'
                                                })
                                            } else {
                                                callback(500, {
                                                    errorMessage : "Server Side problem not updated "
                                                })
                                            }
                                        })
                                    } else {
                                        callback(500, {
                                            errorMessage : "Server Side problem checks data not found"
                                        })
                                    }
                                })
                               
                               
                                 
                                } else {
                                    callback(403, {
                                        errorMessage : "Authentication problem"
                                    })
                                }
                            })
                        } else {
                            callback(500, {
                                errorMessage : "Server Side problem user not found "
                            })    
                        }
                    })
                } else {
                    callback(500, {
                        errorMessage : "Server Side problem token not found"
                    })
                }
            })
        } else {
            callback(403, {
                errorMessage : "You have problem in your request token is not given"
            })
        }
    } else {
        callback(404, {
            errorMessage : "You have problem in your request"
        })
    }
      } else {
        callback(404, {
            errorMessage : "You have problem in your request id not given"
        })
      }
}


handler._check.delete = (requestProperty, callback) => {
    const id = typeof requestProperty.queryObject.id === 'string' && requestProperty.queryObject.id.length === 20 ? requestProperty.queryObject.id : false ;

    if(id) {
      const token = typeof requestProperty.headersObject.token === 'string' && requestProperty.headersObject.token.trim().length >=20 ? requestProperty.headersObject.token : false ;
        if(token) {
            // lock up the check 
            lib.read('checks', id, (err, ckData) => {
                const checksData = parseJSON(ckData)
                if(!err && checksData) {
                    // verify token 
                    _token.verify(token, checksData.userPhone, (tokenIsValid) => {
                        if(tokenIsValid) {
                            // delete checks file 
                            lib.delete('checks', id , (err) => {
                                if(!err) { lib.read('user', checksData.userPhone, (err , userData) => {
                                    const userObj = parseJSON(userData)
                                        if(!err && userObj) {
                                            const usercheck = typeof userObj.check === 'object' && Array.isArray(userObj.check) === true ? userObj.check : [] ; 

                                            const checkPosition = userObj.check.indexOf(id)
                                            if(checkPosition > -1) {
                                                usercheck.splice(checkPosition, 1)

                                                // updat the user 
                                                lib.update('user', userObj.phone , userObj, (err)=> {
                                                    if(!err) {
                                                        callback(200, {
                                                          message : 'deleted successfuly'
                                                        })
                                                    } else {
                                                        callback(500, {
                                                            errorMessage : "server error user not updated "
                                                        })
                                                    }
                                                })
                                            } else {
                                                callback(500, {
                                                    errorMessage : "check not found in user "
                                                })
                                            }
                                        } else {
                                            callback(500, {
                                                errorMessage : "Server Side problem "
                                            })
                                        }
                                    })
                                } else {
                                    
                                }
                            })

                        } else {
                            callback(404, {
                                errorMessage : "Invalid Token"
                            })
                        }
                    } )
                } else {
                    callback(500, {
                        errorMessage : "Server Side problem"
                    })
                }
            })
        } else {
            callback(404, {
                errorMessage : "Token is not found "
            })
        }
    } else {
        callback(404, {
            errorMessage : "You have problem in your request"
        })
    }
} 


module.exports = handler;
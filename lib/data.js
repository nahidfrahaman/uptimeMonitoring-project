/*
title : data file read write 
Description : all of data related function
Author : nahid 
Date : 26-06-24
inspired by : sumit shaha
*/

// dependecies 
const fs = require('fs');
const path = require('path');


// module scaffolding
const lib = {} ;

// base directory
lib.baseDirectory = path.join(__dirname, '../.data')

// write data to file ;
lib.create = (dir, file , data, callback) => {

    // open file for writing 
    fs.open(lib.baseDirectory+'/'+dir+'/'+file+'.json', 'wx' , (err, fileDescriptor) => {
        
        if(!err && fileDescriptor) {
            // success block
            // stringfy data 
            const strigifyData = JSON.stringify(data) ;

            // write data to file and close it
            fs.write(fileDescriptor, strigifyData, (err)=> {
                if (!err) {
                   fs.close(fileDescriptor, (err)=> {
                        if(!err) {
                            callback(false)
                        } else {
                            callback(new Error('file could not closed '))
                        }
                   })
                } else {
                   callback(new Error('file could not created '))
                }
            })
        } else {
            callback( new Error ('Mission failed : could not crate file or may already exist'))
        }
    })
}


lib.read = (dir, file , callback) => {
    fs.readFile(lib.baseDirectory+'/'+dir+'/'+file+'.json', 'utf8' ,(err, data)=> {
       
        callback(err, data) 
      
    })
}

lib.update = (dir, file, data , callback) => {
    // file open 
    fs.open(lib.baseDirectory+'/'+dir+'/'+file+'.json', 'r+' , (err, fileDescriptor)=> {
       
        
        if(!err && fileDescriptor) {
            const stringfyData = JSON.stringify(data)

            // truncate file before update (write) ;
            fs.ftruncate(fileDescriptor, (err)=> {
                if(!err){
                    fs.writeFile(fileDescriptor, stringfyData, (err)=> {
                        if(!err) {
                            fs.close(fileDescriptor, (err)=> {
                                if(!err) {
                                    callback(false)
                                } else {
                                    callback(new Error('error : file not closed '))
                                }
                            })
                        } else {
                            callback(new Error('error : file not updated '))
                        }
                    })
                } else {
                    callback(new Error('error : file not truncate'))
                }
            })
        } else {
            callback(new Error('file not open in fs '))
        }
    })
}

lib.delete =(dir, file ,  callback) => {
    fs.unlink(lib.baseDirectory+'/'+dir+'/'+file+'.json', (err) => {
        if(!err) {
            callback(false) ;
        } else {
            callback(new Error ('error : file not deleting'))
        }
    })
}

lib.changeFileName = (dir , file ,newfile, callback ) => {
    fs.rename(lib.baseDirectory+'/'+dir+'/'+file+'.json', lib.baseDirectory+'/'+dir+'/'+newfile+'.json', (err)=> {
        if(!err) {
            callback(false)
        } else {
            callback(new Error ('filname not changed'))
        }
    } )
}

module.exports = lib ;
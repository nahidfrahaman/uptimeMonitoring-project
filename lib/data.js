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


module.exports = lib ;
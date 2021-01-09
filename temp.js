const fsp = require('fs/promises');
const fs=require('fs')
const path = require('path')

const fileExist = async (fn)=>{
    let result;
    try{
        result = await fsp.stat(path.join(__dirname, 'views', fn), fs.constants.R_OK)
        if (result) result = true;
    } catch{
        result = false
    }
}
fileExist('index.hbs').then((data)=>{console.log(data)}, (err)=>{console.error(err)}); 


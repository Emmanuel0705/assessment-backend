
const catchAsync = require("../util/catchAsync")
const fs = require("fs")
const {promisify} = require("util")
const path = require("path")

exports.logResponse = catchAsync(async (req,res,next) => {
    const data = await promisify(fs.readFile)(path.join(__dirname,'../access.log'), 'utf8');
    res.send(data)  
  })
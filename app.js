const express  = require("express");
const app = express();
const AppError = require("./util/appError")
const globalError = require("./controllers/errorController")
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs")
const path = require("path")

app.use(express.json({extended:false}))
app.use(cors())
app.use(morgan('tiny', {
    stream: fs.createWriteStream(path.join(__dirname,'./access.log'), {flags: 'a'})
}));
app.get('/',(req,res) => (res.send("APP IS RUNNING")));
app.use('/api/v1/on-covid-19/xml', require("./routes/xmlResponse"))
app.use('/api/v1/on-covid-19/logs', require("./routes/logs"))
app.use('/api/v1/on-covid-19', require("./routes/jsonResponse"))
app.all("*", (req,res,next) => {
    const err = new AppError(`Cant find ${req.originalUrl} on this server`,404)
    next(err)
})
app.use(globalError)

module.exports = app
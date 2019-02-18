const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const https = require("https"),
  fs = require("fs");
var cors = require('cors');
var routes = require('./app/routes');
var jwtAuth = require('./app/middlware/jwtAuth');

dotenv.config();
const app = express();
morgan('tiny');


// Connect to database
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connection established');
});

// Configure express app
app.set('superSecret', process.env.APP_SECRET);
app.disable('x-powered-by')
var corsOptions = {
    origin: process.env.FRONT_URL,
    credentials: true
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan(process.env.APP_ENV));
app.use(jwtAuth);
app.use('/',routes);

// Start express app
app.listen(process.env.APP_PORT, () => console.log(`App started on port ${process.env.APP_PORT}`))

if(process.env.APP_SECURE!="false"){
    const options = {
        key: fs.readFileSync(process.env.APP_KEY),
        cert: fs.readFileSync(process.env.APP_CERT)
      };
    https.createServer(options, app).listen(process.env.APP_SECURE_PORT);
}
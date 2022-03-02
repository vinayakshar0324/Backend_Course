const express = require('express');
require('dotenv').config();
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

//reg. middlwares
app.use(express.json());
app.use(express.urlencoded());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//cookie and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));


//temp check
app.set('view engine', "ejs");


//middleware
app.use(morgan('tiny'))


app.get('/signuptest', (req, res) => {
    res.render('signup.ejs');
})


// import all routes here
const home = require('./routes/home');
const user = require('./routes/user');  




//router middleware
app.use('/api/v1', home);
app.use('/api/v1', user);



//export app
module.exports = app;
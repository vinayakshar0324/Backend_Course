const mongoose = require('mongoose')

const {MONGODB_URL} = process.env

exports.connect = () => {
    mongoose.connect(MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    
    })
    .then(
        console.log(`DB Connected Succesfully`)
    )
    .catch(error => {
        console.log('DB connection failed');
        console.log(error);
        process.exit(1)
    });
    
    
}


//Anything you do with mongoose is a promise


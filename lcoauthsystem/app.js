require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken') 
const cookieParser = require('cookie-parser');

const User = require('./models/user');
const auth = require('./middlewares/auth');


app.use(express.json());
app.use(cookieParser());


app.get('/', (req,res)=> {
    res.send("<h1>hello from auth systems</h1>")
});

app.post('/register', async(req,res)=> {
    const {firstName, lastName, email, password} = req.body;

    if(!(firstName && lastName && email && password)){
        res.status(400).send('all fields are required')
    }

    const extistingUser = await User.findOne({email}) //PROMISE

    if(extistingUser){
        res.status(401).send('user already exists')
    }

    const myEncPassword = await bcrypt.hash(password, 10)

   const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: myEncPassword
    });

    // token
    const token = jwt.sign(
        {user_id: user._id, email},
        process.env.SECRET_KEY,
        {
            expiresIn: '2h'
        }
    )
    user.token = token

        //password situation
        user.password = undefined;

    // send a token or send just success yes and redirect - choice
    res.status(201).json(user)

});

app.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body

        if(!(email && password)){
            res.status(400).send('fields is missing')
        }

        const user = await User.findOne({email})

        // if(!user){
        //     res.status(400).send("You are not registered")
        // }

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {user_id: user.id, email},
                process.env.SECRET_KEY,
                {
                    expiresIn: '2h'
                }
            )

            user.token = token
            user.password = undefined
            // res.status(200).json(user);

            //if you want to use cookies
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
        }

        res.send(400).send("email or passoword id incorrect")

        
        

    } catch (error) {
        console.log(error);
    }
});

app.get('/dashboard', auth, (req,res)=> {
    res.send("welcome to dashboard")
});

module.exports = app



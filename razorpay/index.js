const express = require('express')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello')
});

app.post('/order', (req, res) => {
    const amount  = req.body.amount

    var instance = new Razorpay({ key_id: 'YOUR_KEY_ID', key_secret: 'YOUR_SECRET' })

    instance.orders.create({
    amount: 50000,
    currency: "INR",
    receipt: "receipt#1",
    notes: {
        key1: "value3",
        key2: "value2"
    }
})



});



app.listen(4000, () => console.log(`server is running at 4000`));
const express = require('express')
const fileUpload = require('express-fileupload');
const cloudnairy = require('cloudinary').v2
const app = express()

cloudnairy.config({
    // cloud_name: process.env.CLOUD_NAME
    cloud_name: 'dn2dpixjr', 
    api_key: '794632631971579', 
    api_secret: 'EBDNrQFb_JADqf2ZcRXM96txgMQ' 
})

app.set("view engine", "ejs")




//middleware
app.use(express.json())
app.use(express.urlencoded());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/'
}))

app.get('/myget', (req,res) => {
    console.log(req.body);
    console.log(req.files);
    res.send(req.body)
});



app.post('/mypost', (req, res)=> {
    console.log(req.body);
    console.log(req.files);


    let result;
    let imageArray = []

    // case for multiple images

    if(req.files){
        for (let index = 0; index < req.files.samplefile.length; index++) {
        let result = await cloudnairy.uploader.upload(req.files.samplefile[index].tempFileDir, {
                folder: "users"
            })
            imageArray.push({
                public_id: result.public_id,
                secure_url: result.secure_url
            })
    }



    // ###case for single images
    // let file  = req.files.samplefile
    // result = cloudnairy.uploader.upload(file, {
    //     folder: 'users'
    // })
    // console.log(result);

    details = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        result,
        imageArray
    }

    res.send(req.body);
    }


app.get('/mygetform', (req, res) => {
    res.render('getForm');
});

app.get('/mypostform', (req, res) => {
    res.render('postForm');
});




app.listen(4000, () => console.log(`server is running at 4000`));



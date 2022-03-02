const express = require('express')

const app = express()

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const fileUpload = require('express-fileupload')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())
app.use(fileUpload())

let courses = [
    {
        id: '11',
        name: ' learn reactjs',
        price: 199
    },
    {
        id: '22',
        name: ' learn django',
        price: 299
    },
    {
        id: '33',
        name: ' learn vuejs' ,
        price: 399
    }
]


app.get('/', (req, res) =>{
    res.send("hello from lco")
})

app.get('/api/v1/lco', (req, res) => {
    res.send('hello from lco docs')
})

app.get('/api/v1/lcoobject', (req, res) => {
    res.json({ id: '55', price: 199, name: "Learncode backend" })
})

app.get('/api/v1/courses', (req, res) => {
    res.send(courses)
})


app.get('/api/v1/mycourses/:courseId', (req,res) => {
    const mycourses = courses.find(course => course.id === req.params.courseId)
    res.send(mycourses)
})


app.post('/api/v1/addCourse', (req, res) => {
    console.log(req.body);
    courses.push(req.body)
    res.send(true)
})

app.get('/api/v1/coursequery', (req, res) => {
   let location = req.query.location
   let device = req.query.device

    res.send({ location, device })

})


app.post('/api/v1/courseUpload', (req, res) => {
    const file = req.files.file
    let path = __dirname + '/images/' + Date.now() + 'jpg'

    file.mv(path, (err) => {
        res.send(true)
    });

});

app.listen(4000, ()=>{
    console.log(`server is running at port 4000`)
})
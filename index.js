'use strict'

const Joi = require('joi');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const flash = require('req-flash');
const cors = require('cors');
const hbs = require('express-handlebars'); 
const app = express();
const port = process.env.PORT || 4000;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reportes'
});

// connect to database
db.connect((err) => {
    if (err) { throw err; }console.log('Connected to database');
});
global.db = db;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// configure middleware
//Fontaneria para motor de templates
app.engine('.hbs', hbs({
    defaultLayout: 'default',
    extname: '.hbs'
}))
app.set('view engine', '.hbs')
//app.use(express.json());

const courses = [
    {id: 1, name: 'course 1'},
    {id: 2, name: 'course 2'},
    {id: 3, name: 'course 3'}
];

/*
app.get('/', (req, res)=>{
    res.send('Hola que hace!!');
});*/
/*
app.get('/', function(req, res, next) {
    db.query('SELECT * FROM solicitud ORDER BY folio desc',function(err,rows){
    if(err){
        req.flash('error', err); 
        res.render('/',{page_title:"Customers - Node.js",data:''});   
    }else{
        res.render('consulta1',{            
            page_title:"Customers - Node.js",data:rows
        });
    }
    });
});
*/
app.get('/', function(req, res, next){
        
    db.query('SELECT * FROM solicitud ORDER BY folio desc', function(err, rows, fields) {
        if(err) throw err // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Customers not found')
            res.redirect('/')
        }else {// render to views/user/edit.ejs template file
            res.render('consulta1',{data:rows});
            /*res.render('consulta1', {
                title: 'Edit Customer', 
                data: rows[0],
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email
            })*/
        }
    })
})
    



app.get('/api/courses', (req, res)=>{
    res.send(courses);
});
app.get('/api/courses', (req, res)=>{
    
    const {error}= validateCourse(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length+1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.get('/login', (req, res)=>{
    res.render('form1')
})

app.put('/api/courses/:id',(req,res)=>{
    //Look up the course, If not existing, return 404
    const course = courses.find(c=> c.id===parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found');
    //Validate, If invalid, return 400 - Bad request
    const {error}= validateCourse(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    //Update course, Return the update course    
    course.name = req.body.name;
    res.send(course);
});

app.get('/api/courses/:id', (req,res)=>{
    const course = courses.find(c=> c.id===parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found');
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`);
});
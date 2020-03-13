const express = require('express');
const app = express();

app.get('/', (req, res)=>{
    res.send('Hola que hace!!');
});

app.get('/api/courses', (req, res)=>{
    res.send([1,2,3,4]);
});

app.get('/api/posts/:year/:mont', (req,res)=>{
    res.send(req.params);
});

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`);
});
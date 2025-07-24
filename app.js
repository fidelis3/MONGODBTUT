const express=require('express');

//initialize express app and middleware
const app=express();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


//routes

app.get('/books', (req, res) => {
    res.json('Welcome to the api');
    });
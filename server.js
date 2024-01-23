const express = require('express');
const colors=require('colors');
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');
const server = express();
const authRoute = require('./routes/authRoute');
const dotenv= require('dotenv').config();
const PORT = process.env.PORT
const  cors = require('cors');
dbConnect();

// middleware

server.use(cors());
server.use(express.json());
server.use(morgan('dev'));

// routes ---
server.use('/api/v1/auth',authRoute);

server.get('/',(req,res)=>{
    res.send({message:'welcome to ecommerce app'})

})

server.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`.bgCyan.white);
})
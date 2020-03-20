
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});


const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

const checkAuth = require('./middleware/checkAuth');


const app = express();


//DB
const DB = process.env.DB;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => {
    console.log('successfully connected to DB');
})
.catch(err => console.log(err));




//MIDDLEWARES
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());



//ROUTES

app.use('/auth', authRoutes);
app.use('/post', checkAuth, postRoutes);



const PORT = 8080;
app.listen(PORT, () => {
    console.log('server listening on port ', PORT);
})
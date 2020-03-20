
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');



const register = async (req, res, next) => {
    
    //validate data from req.body 

    //check if user exists in DB, if yes return error;
    const existEmail = await User.findOne({email: req.body.email});
    if (existEmail){
        return res.status(400).json({
            status: 'fail',
            error: 'Email already exists in database'
        });
    }

    //hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{

        await newUser.save();
        res.status(200).json({
            status: 'success',
            data: {
                user: newUser
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }

}



const login = async (req, res, next) => {

    //validate req.body

    //check if user exists in DB
    const user = await User.findOne({email: req.body.email});
    if (!user){
        return res.status(400).json({
            status: 'fail',
            error: 'User not found'
        });
    }

    try{

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch){
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid credentials'
            });
        }

        //create and attach token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.header('auth-token', token);

        res.status(200).json({
            status: 'success',
            token: token,
            data: {
                user: user
            }
        })

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }

}


module.exports = {
    register: register,
    login: login
}
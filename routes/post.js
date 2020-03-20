
const express = require('express');


const router = express.Router();


router.get('/', (req, res, next) => {

    res.status(200).json({
        status: 'success',
        user: req.user
    });
});





module.exports = router;
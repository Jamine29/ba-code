const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./configs/keys.js');
const passport = require('passport')

// middleware
app.use(express.static('public'))

app.use(
    bodyParser.urlencoded({ 
        extended: true 
    })
);
app.use(bodyParser.json());

//app.use(express.json())
//app.use(express.urlencoded({ extended: true }))

// caused =>  Error: Not allowed by CORS while running the test
// This is CORS-enabled for a whitelisted domain.

var whitelist = ['http://localhost:5000', 'http://localhost:3000', 'http://localhost:8080', undefined];

var corsOptions = {
    origin: function (origin, callback) {
        // indexOf return -1 when value is not in the array
        if(whitelist.indexOf(origin) !== -1) {
            // callback(error, response)
            callback(null, true);
        } 
        else {
            callback(new Error('Not allowed by CORS'), false);
        }
    }
};
 
app.use(cors(corsOptions));

// DB
const store = require('./store/index')

// Routes
app.get('/secret', passport.authenticate('jwt',{session: false}),(req,res,next) => {
    console.log(req.user)
    res.json("Secret Data")
})

// /api/v1/users

app.use('/artists', require('./routes/artist')) 
app.use('/groups', require('./routes/group'))
app.use('/images', require('./routes/image')) 
app.use('/search', require('./routes/search'))
app.use('/auth', require('./routes/auth'))
app.use('/dashboard', passport.authenticate('jwt',{session: false}), require('./routes/dashboard'))
app.use(function(req, res) {
    res.type('text/plain').status(404).send('404: Page not Found.');
});

// Server

const port = process.env.PORT || 8000;

// start server
const server = app.listen(port, () => console.log(`App listening on port: ${port}`));

module.exports = app;
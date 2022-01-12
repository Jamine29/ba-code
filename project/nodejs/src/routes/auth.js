const router = require ('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const passport = require('../middleware/passport')
const { validationResult } = require('express-validator');
const { registerValidation, loginValidation } = require('../helpers/validation')

const generateToken = user => {
    return jwt.sign({
      iss: 'Joan_Louji',
      sub: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    }, 'joanlouji');
}

router.post('/sign-up', registerValidation, async (req, res) => {
    // get validation errors 
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(422).json({success: false, err: errors.mapped()})
    }

    const {email, password} = req.body;

    // check if user exists
    let foundUser = await User.findOne({email});    
    
    if (foundUser !== null) {
        return res.status(422).json({err: {email: 'Email is already in use.'}, token: undefined});
    }
    
    // hash password before saving in database synchron and not asynchron
    let hashedPassword = bcrypt.hashSync(password, 10);

    // create and save user
    const newUser = new User(
        { 
            email: email, 
            password: hashedPassword 
        }
    )

    await newUser.save().catch((err => res.status(422).json({success: false, message: 'Something went wrong. Try it later again.'})))
    
    // Generate JWT token
    const token = generateToken(newUser)

    res.status(200).json({token})
});

router.post('/login', loginValidation, async (req, res) => {
    const {email, password} = req.body
    
    // check if user with given email exist
    User
    .findOne({email: email})
    .then((user) => {
        if(user !== null && bcrypt.compareSync(password, user.password)) {
            // Generate JWT token
            const token = generateToken(user)

            res.status(200).json({token, email}) 
        }
        else {
            res.status(422).json({ success: false, err: 'Email or Password is wrong.'});
        }
    })
});

module.exports = router;

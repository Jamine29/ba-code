const { check } = require('express-validator');

const registerValidation = [
    check('email')
        .exists()
        .withMessage('E-Mail doesnt exist.')
        .trim()
        .isEmail()
        .withMessage('E-Mail is in wrong format.'),
    check('password')
        .exists()
        .withMessage('Password doesnt exist')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password length should be min 6 characters without space before and after the word')
];

const loginValidation = [
    check('email')
        .exists()
        .withMessage('E-Mail doesnt exist.')
        .trim()
        .isEmail()
        .withMessage('E-Mail is in wrong format.'),
    check('password')
        .exists()
        .withMessage('Password doesnt exist')
        .trim()
        .isLength({ min: 6, max: 15 })
        .withMessage('Password length should be min 6 characters without space before and after the word')
];

const artistValidationCreate = [
    check('birthName')
        .exists()
        .withMessage('Birthname doesnt exist.')
        .not()
        .isEmpty()
        .withMessage('Birthname should not be Empty.'),
    check('stageName')
        .exists()
        .withMessage('Stagename doesnt exist.')
        .not()
        .isEmpty()
        .withMessage('Stagename should not be Empty.'),
    check('birthday')
        .exists()
        .withMessage('Birthday doesnt exist.')
        .not()
        .isEmpty()
        .withMessage('Birthday should not be Empty.')
];

const artistValidationUpdate = [
    check('birthName')
        .exists()
        .withMessage('Birthname doesnt exist.')
        .not()
        .isEmpty()
        .withMessage('Birthname should not be Empty.'),
    check('stageName')
        .exists()
        .withMessage('Stagename doesnt exist.')
        .not()
        .isEmpty()
        .withMessage('Stagename should not be Empty.'),
    check('birthday')
        .exists()
        .withMessage('Birthday doesnt exist.')
        .not()
        .isEmpty()
        .withMessage('Birthday should not be Empty.')
];

const groupValidationCreate = [
    check('name')
        .exists()
        .withMessage('Birthname doesnt exist.')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Birthname should not be Empty.')
];

const groupValidationUpdate = [
    check('name')
        .exists()
        .withMessage('Name doesnt exist.')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name should not be Empty.')
];

module.exports = {
    registerValidation,
    loginValidation,
    artistValidationCreate,
    artistValidationUpdate,
    groupValidationCreate,
    groupValidationUpdate
}

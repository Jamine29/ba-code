export const loginConstraints = {
    email: {
        email: {
            message: ' is not valid.'
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 6,
            message: 'must be min 6 characters long.'
        }
    }
}

export const signUpConstraints = {
    email: {
        email: {
            message: ' is not valid.'
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 6,
            message: 'must be min 6 characters long.'
        }
    }
}

export const changeEmailConstraints = {
    email: {
        email: {
            message: ' is not valid.'
        }
    }
}

export const changePasswordConstraints = {
    currentPassword: {
        presence: true,
        length: {
            minimum: 6,
            message: 'must be min 6 characters long.'
        }
    },
    newPassword: {
        presence: true,
        length: {
            minimum: 6,
            message: 'must be min 6 characters long.'
        }
    }
}
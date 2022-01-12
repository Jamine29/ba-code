// Format of token
// authorization: Bearer <access_token>

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get tocken from array
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // next middleware
        next();
    }
    else {
        res.sendStatus(403);
    }
}

module.exports = verifyToken;
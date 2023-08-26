const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({ error: 'Token manquant' });
    
        }   
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SRCRET');
        const userId = decodedToken.userId;
        req.auth = {userId : userId}
        next();

    }
    catch(err) {
        res.status(401).json({err})
    }

}
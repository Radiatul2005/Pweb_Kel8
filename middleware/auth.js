// const jwt = require('jsonwebtoken');


// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).send('Access Denied');

//   jwt.verify(token, 'your_jwt_secret', (err, user) => {
//     if (err) return res.status(403).send('Invalid Token');
//     req.user = user;
//     next();
//   });
// }

// module.exports = authenticateToken;

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || '';
    if (!token) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports={
    verifyToken
}
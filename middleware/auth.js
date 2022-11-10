// On importe jwt
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // On récupère le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        // Mettre le userId dans la requête
        req.auth = {
            userId: userId
        };
    }
    catch (error) {
        console.log(error);
        res.status(401).json({error});
    }
};


// On importe jwt
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        console.log("hello");
        const token = req.headers.authorization.split(" ")[1]; // On récupère le token
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;
        // Mettre le userId dans la requête
        req.auth = {
            userId: userId
        };
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({error});
    }
};


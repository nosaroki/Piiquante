// On importe jwt
const jwt = require("jsonwebtoken");

// On appel .env pour utiliser les variables d'environnement
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
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


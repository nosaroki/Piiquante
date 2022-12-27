// On créé le middleware qui vérifie que l’utilisateur est connecté et transmet les infos de connexion
// aux différentes méthodes qui vont gérer les requêtes.

// On importe jwt
const jwt = require("jsonwebtoken");

// On appel .env pour utiliser les variables d'environnement
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;
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


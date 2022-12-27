// On importe les packages
const express = require("express"); // pour créer une application express
const mongoose = require("mongoose"); // permet d'utiliser des fonctions complètes pour intéragir avec la bdd
const bodyParser = require('body-parser'); // permet d'analyser JSON, du texte brut ou de renvoyer un objet
const path = require("path"); // permet de connaitre le chemin du système de fichier
const helmet = require("helmet"); // aide à sécuriser l'application Express en définissant divers en-têtes HTTP
const cors = require("cors");
// On importe les routes
const userRoutes = require("./routes/user_route");
const sauceRoutes = require("./routes/sauce_route");

const app = express(); // === on créé une application express
require('dotenv').config(); // on appel .env pour utiliser les variables d'environnement
app.use(helmet());
app.use(cors());


// On définit l'accès à la bdd MongoDB (avec les vard'env pour ne pas transmettre les logs de connexion en clair)
mongoose.connect(process.env.MONGO_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée.'));

// Middleware Header pour la sécurité CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise l'accès à l'API pour n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Définit les Headers utilisés par l'API
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Définit les méthodes possibles à utiliser
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});


app.use(bodyParser.json()); // Transformer le JSON en JS utilisable
app.use("/api/auth", userRoutes); // Route d'authentification
app.use("/api/sauces", sauceRoutes); // Route sauces
app.use("/images", express.static(path.join(__dirname, "images"))); // pour accéder aux images du dossier

// On exporte l'app pour y accéder depuis les autres fichiers dont server node
module.exports = app;

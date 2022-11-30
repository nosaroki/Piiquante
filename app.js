// On importe les packages
const express = require("express"); // pour créer une application express
const mongoose = require("mongoose"); // permet d'utiliser des fonctions complètes pour intéragir avec la bdd
const bodyParser = require('body-parser');
const path = require("path"); // permet de connaitre le chemin du système de fichier
const helmet = require("helmet"); // aide à sécuriser l'application Express en définissant divers en-têtes HTTP
const cors = require("cors");
// On importe les routes
const userRoutes = require("./routes/user_route");
const sauceRoutes = require("./routes/sauce_route");

const app = express(); // === on créé une application express
require('dotenv').config(); // on appel .env pour utiliser les variables d'environnement
app.use(helmet()); // on utilise les services des middlewares proposés par helmet
app.use(cors());


// On définit l'accès à la bdd MongoDB (avec les vard'env pour ne pas transmettre les logs de connexion en clair)
mongoose.connect(process.env.MONGO_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée.'));

// Middleware Header pour la sécurité CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});



app.use(bodyParser.json());
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

// On exporte l'app pour y accéder depuis les autres fichiers dont server node
module.exports = app;

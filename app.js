// On importe express + mongoose + express
const express = require("express");
const mongoose = require("mongoose");
const app = express(); // === on créé une application express
const userRoutes = require("./routes/user");

require('dotenv').config();

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
  next();
});


app.use((req, res) => {
    res.json({message: "Votre requête a bien été reçue !"});
})

 app.use("/api/auth", userRoutes);

// On exporte l'app pour y accéder depuis les autres fichiers dont server node
module.exports = app;

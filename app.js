// On importe les packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
// On importe les routes
const userRoutes = require("./routes/user_route");
const Sauce = require("./models/sauce");

const app = express(); // === on créé une application express
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




// app.use("/api/sauce", (req, res, next) => {
//   delete req.body._id;
//   const sauce = new Sauce ({
//     ...req.body
//   });
//   sauce.save()
//   .then(() => res.status(201).json({message: "Sauce créée !"}))
//   .catch(error => {
//     console.log(error);
//     res.status(400).json({error});
//   });
// })

app.use(bodyParser.json());
app.use("/api/auth", userRoutes);


// On exporte l'app pour y accéder depuis les autres fichiers dont server node
module.exports = app;

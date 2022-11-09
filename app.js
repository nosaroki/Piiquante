// On importe express + mongoose + express
const express = require("express");
const mongoose = require("mongoose");
const app = express(); // === on créé une application express
const userRoutes = require("./routes/user");


mongoose.connect('mongodb+srv://2ne:yGi1QanT3aR491YN@cluster0.kcqg79w.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res) => {
    res.json({message: "Votre requête a bien été reçue !"});
})

 app.use("/api/auth", userRoutes);

// On exporte l'app pour y accéder depuis les autres fichiers dont server node
module.exports = app;

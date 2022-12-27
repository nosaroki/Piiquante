// On importe les packages
const express = require("express"); // Pour utiliser la fonction routeur d'express
const router = express.Router();
const userCtrl = require("../controllers/user_ctrl");

// Routes post car le frontend enverra email + mdp
router.post("/signup", userCtrl.signup); // créé la fiche user
router.post("/login", userCtrl.login); // créé fiche login

module.exports = router;
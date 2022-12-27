// On importe les packages
const express = require("express"); // Pour utiliser la fonction routeur d'express
const router = express.Router();
const userCtrl = require("../controllers/user_ctrl");
const password = require("../middleware/password");

// Routes post car le frontend enverra email + mdp
router.post("/signup", password, userCtrl.signup); // créé la fiche user
router.post("/login", userCtrl.login); // créé fiche login

module.exports = router;
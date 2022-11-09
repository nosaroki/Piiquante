const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// Routes post car le frontend enverra email + mdp
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
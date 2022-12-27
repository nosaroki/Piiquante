// On importe les package et middleware nécessaires
const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce_ctrl");
const auth = require ("../middleware/auth");
const multer = require("../middleware/multer-config"); // Pour télécharger des fichiers

// CRUD
// On applique le middleware auth sur toutes les routes à protéger
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeOrDislike);


module.exports = router;
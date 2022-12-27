// On créé les middlewares d'authentification

// On importe les packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
// On importe le modèle
const User = require("../models/User"); 

// Pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {

if (!validator.validate(req.body.email)) {
  res.status(400).json({message: "Votre adresse email n'est pas au bon format."});
};
  bcrypt.hash(req.body.password, 10) 
    .then((hash) => {
      const user = new User({ 
        email: req.body.email,
        password: hash
      });
      console.log(user);
      user.save()
        .then(() => 
        { console.log("test");
          res.status(201).json({message: "Utilisateur créé !"})})
        .catch((error) => {
          console.log(error);
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

// Pour connecter les utilisateurs existants
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({message: "Paire identifiant / mot de passe incorrecte"});
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({message: "Paire identifiant / mot de passe incorrecte"});
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  process.env.SECRET_TOKEN,
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

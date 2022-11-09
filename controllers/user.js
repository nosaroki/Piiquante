// On créé les middlewares d'authentification

const bcrypt = require("bcrypt");
const User = require("../models/User"); // On importe le modèle
const jwt = require("jsonwebtoken");

// Pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // On hash le mdp avec une fonction asynchrone
    .then((hash) => {
      const user = new User({
        // On enregistre le hash du mdp dans un nv user qu'on save dans la BDD
        email: req.body.email,
        password: hash,
      });
      console.log(user);
      user
        .save()
        .then(() => res.status(201).json({message: "Utilisateur créé !"}))
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
  User.findOne({ email: req.body.email }) // promesse retournée par findOne
    .then((user) => {
      // Vérifier si l'utilisateur existe
      if (user === null) {
        res
          .status(401)
          .json({message: "Paire identifiant / mot de passe incorrecte"});
      } else {
        // Check si le mdp correspond à celui associé à l'utilisateur dans la bdd
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
                toen: jwt.sign(
                  //payload = les données que l'on veut encoder dans un TOKEN
                  { userId: user._id },
                  "RANDOM_TOKEN_SECRET",
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

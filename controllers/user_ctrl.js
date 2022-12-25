// On créé les middlewares d'authentification

// On importe les packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var passwordValidator = require('password-validator');
var validator = require("email-validator");
// On importe le modèle
const User = require("../models/User"); 

// Pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Validate against a password string
if (!schema.validate(req.body.password)){
  res.status(400).json({message: "Veuillez choisir un mot de passe avec 8 caractères minimum, 1 majuscule, 1 minuscule, 2 chiffres et sans espace."});
};
 
if (!validator.validate(req.body.email)) {
  res.status(400).json({message: "Votre adresse email n'est pas au bon format."});
};
  bcrypt.hash(req.body.password, 10) // On hash le mdp avec une fonction asynchrone
    .then((hash) => {
      const user = new User({
        // On enregistre le hash du mdp dans un nv user qu'on save dans la BDD
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
                token: jwt.sign(
                  //payload = les données que l'on veut encoder dans un TOKEN
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

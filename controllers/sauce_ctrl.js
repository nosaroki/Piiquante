// importing the packages
const Sauce = require("../models/sauce");
const fs = require("fs");

// On renvoie le tableau contenant toutes les sauces de notre bdd
exports.getAllSauce = (req, res, next) => {
    console.log("coucou");
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

// On renvoie une seule sauce en check son id
exports.getOneSauce =  (req, res, next) => {
    console.log("heyyyyy");
  Sauce.findOne({ _id: req.params.id }) // ":" pour rendre la route accessible en tant que paramètre
    .then((sauce) => 
    {
        console.log(sauce);
        res.status(200).json(sauce)})
    .catch((error) => {
      console.log(error);
      res.status(404).json({ error });
    });
};

// On créé une instance du modèle Sauce en lui passant un objet JS contenant toutes les informations requises du corps de requête analysé
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id; // id généré automatiquement par la BDD
    //delete sauceObject._userId; // vient du TOKEN - correspond à la personne qui a créé l'objet - Ne pas faire confiance au client
    const sauce = new Sauce({
      // on créé notre objet
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    //   likes: 0,
    //   dislikes: 0,

    });
    sauce
      .save()
      .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
      .catch((error) => {
        console.log(error);
        res.status(400).json({ error });
      });
  };

// On créé une route pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file? {
        // on check s'il y a un champ file
        ...JSON.parse(req.body.sauce), // si oui on récup l'objet et son image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body }; // si ce n'est pas le cas on récupère l'objet directement dans le corps de la requête

  delete sauceObject._userId; // On supprime le userID venant de la requête pour éviter que qqn créé un objet à son nom puis le modifie pour le réassigner à qqn d'autre
  Sauce
    .findOne({ _id: req.params.id }) // On cherche l'objet dans la BDD pour voir s'il appartient à son créateur
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { // on check si le userId enregistré en bdd correspond à celui qu'on recup du TOKEN
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => {
            console.log(error);
            res.status(401).json({ error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

// On créé une route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
      if (sauce.userId != req.auth.userId) {
          res.status(401).json({message: "Non-autorisé"});
      }
      else { // si c'est le bon user faut supprimer l'objet ET l'image de la bdd
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink("images/${filename}", () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "Sauce supprimée !"}))
            .catch(error => {
                console.log(error);
                res.status(401).json({error});
            });
        });
      };
  })
  .catch(error => {
      console.log(error);
      res.status(500).json({error});
  });
};

// On créé une route pour le like ou dislike
exports.likeOrDislike = (req, res) => {
    // const stateLike = req.params.like;
    // const idUserLike = req.params.userId;
    // const idSauceLike = req.params.id;
};
// importing the packages
const Sauce = require("../models/sauce");
const fs = require("fs");

// On renvoie le tableau contenant toutes les sauces de notre bdd
exports.getAllSauce = (req, res, next) => {
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
  Sauce.findOne({ _id: req.params.id })
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
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Requête non-autorisé" });
        return false;
      } else {
        console.log("oui")
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => {
            console.log(error);
            res.status(401).json({ error });
          });
        });
        };
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
          return false;
      }
      else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
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
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch (req.body.like) {
        case -1:
          Sauce.findOne(req.params)
          Sauce.findByIdAndUpdate(req.params.id, {
            ...sauce,
            dislikes: sauce.dislikes++,
            usersDisliked: sauce.usersDisliked.push(req.auth.userId),
          })
            .then(() => res.status(200).json({message: "Je n'aime pas" }))
            .catch(error => res.status(401).json({ error }));
          break;
        case 0:
          if (sauce.usersLiked.includes(req.auth.userId)) {
            const indexOfUser = sauce.usersLiked.indexOf(req.auth.userId);
            Sauce.findByIdAndUpdate(req.params.id, {
              ...sauce,
              likes: sauce.likes--,
              usersLiked: sauce.usersLiked.splice(indexOfUser, 1),
            })
              .then(() => res.status(200).json({message: "Sans avis"}))
              .catch(error => res.status(401).json({ error }));
          }
          if (sauce.usersDisliked.includes(req.auth.userId)) {
            const indexOfUser = sauce.usersDisliked.indexOf(req.auth.userId);
            Sauce.findByIdAndUpdate(req.params.id, {
              ...sauce,
              dislikes: sauce.dislikes--,
              usersDisliked: sauce.usersDisliked.splice(indexOfUser, 1),
            })
              .then(() => res.status(200).json({message: "Sans avis"}))
              .catch(error => res.status(401).json({ error }));
          }
          break;
        case 1:
          Sauce.findByIdAndUpdate(req.params.id, {
            ...sauce,
            likes: sauce.likes++,
            usersLiked: sauce.usersLiked.push(req.auth.userId),
          })
            .then(() => res.status(200).json({message: "J'aime"}))
            .catch(error => res.status(401).json({ error }));
          break;
      }
    })
    .catch(error => res.status(401).json({ error }));
};
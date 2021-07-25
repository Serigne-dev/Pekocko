const Sauce = require('../models/Sauce'); // import de notre modele sauce
const fs = require('fs');// file system, permet de modifier le systeme de fichiers (suppression)

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce)) // envoi la sauce au front-end
  .catch(error => res.status(404).json({ error })); // si sauce non trouvée envoi erreur 404 au front-end, avec l'erreur generée
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);// analyse de la chaine sauce pour la convertir en objet utilisable
  const sauce = new Sauce({
    ...sauceObject, // fais une copie de tous les elements de sauceObject
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// resoud l'url
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
  .catch(error => res.status(400).json({ error }));  
};


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // regarder si req.file existe
  { // l'iimage a été modifiée donc on traite la nouvelle image
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };// l'image n'a pas été modifiée
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];// separe le nom du fichier avec le segement /image/
    fs.unlink(`images/${filename}`, () => { // supprime le fichier
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
  .then(sauce => {
    const aime = req.body.like;
    const idUser = req.body.userId;
    console.log("aime: "+ aime);
    if (aime == 1){
       Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: idUser },
        }
      )
        .then(() => {
          res.status(201).json({ message: "Vote enregistré." });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    }
    else if (aime == 0){
      //supression user du tableau de like
      if (sauce.usersLiked.find((user) => user === idUser)) {
        Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: idUser },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Vote enregistré." });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
      }
      //supression user du tableau de dislike
      if (sauce.usersDisliked.find((user) => user === idUser)) {
        Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: idUser },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Vote enregistré." });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
      }
    } 
    else if(aime == -1){
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: idUser },
        }
      )
        .then(() => {
          res.status(201).json({ message: "Vote enregistré." });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    }
    else{
      console.error("bad request");
    }
    })
    .catch(error => res.status(500).json({ error }));
};

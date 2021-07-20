const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.getAllSauces = (req, res, next) => {
  console.log("NEWWWWW");
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
 Sauce.findOne({ _id: req.params.id })
 .then(sauce => res.status(200).json(sauce))
 .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
  console.log("New sauce 1: "+sauceObject);
  const sauceObject = JSON.parse(req.body.sauce); 
  console.log("New sauce : "+sauceObject);
  delete sauceObject._id;
  const sauce = new sauce({
     ...sauceObject,
     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
  .catch(error => res.status(400).json({ error }));  
};

/*
exports.modifySauces = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
*/

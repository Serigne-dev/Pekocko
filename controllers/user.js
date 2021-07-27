const bcrypt = require('bcrypt'); // package de chiffrement
const jwt = require('jsonwebtoken'); // pour créer et verifier les tokens
const User = require('../models/User');
var CryptoJS = require("crypto-js"); // permet de crypter l'email

function validationPassword(password){
  if (password.match( /[0-9]/g) && 
                    password.match( /[A-Z]/g) && 
                    password.match(/[a-z]/g) && 
                    password.match( /[^a-zA-Z\d]/g) &&
                    password.length >= 8){
             } 
            else {
                throw 'Mot de passe trop faible.'; } 
}

//pour que l'utilisateur s'inscrive
exports.signup = (req, res, next) => {
  try{
    validationPassword(req.body.password);
    bcrypt.hash(req.body.password, 10) //fonction hashage de bcrypt, mot de passe salé 10fois
    .then(hash => { // hash généré
      const user = new User({ //création utilisateur avec mot de passe haché
        email: CryptoJS.MD5(req.body.email).toString(),
        password: hash
      });
      user.save() // enregistrement utilisateur
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  }catch(e){
    return res.status(401).json({e});
  }
	 
};

//pour que l'utilisateur se connecte
exports.login = (req, res, next) => {
	User.findOne({ email: CryptoJS.MD5(req.body.email).toString() }) // verification email
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // compare le mdp entré par l'utilisateur avec le hash de la bdd
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({ //reponse 200 avec userID et token
            userId: user._id,
            token: jwt.sign( // sign de json web token pour encoder nouveau token
              { userId: user._id },// token contient l'id user en tant que payload
              'RANDOM_TOKEN_SECRET', //chaine secrete de developpement temporaire pour encoder le token
              { expiresIn: '24h' } // durée de validité du token
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
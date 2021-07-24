const bcrypt = require('bcrypt'); // package de chiffrement
const jwt = require('jsonwebtoken'); // pour créer et verifier les tokens

const User = require('../models/User');

exports.signup = (req, res, next) => {
	 bcrypt.hash(req.body.password, 10) //fonction hashage de bcrypt, mot de passe salé 10fois
    .then(hash => { // hash généré
      const user = new User({ //création utilisateur avec mot de passe haché
        email: req.body.email,
        password: hash
      });
      user.save() // enregistrement utilisateur
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email }) // verification email
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
            token: jwt.sign( // sgn de json web token pour encoder nouveau token
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
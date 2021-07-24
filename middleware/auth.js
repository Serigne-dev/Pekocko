const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // on extrait le token du header authorization de la requete entrante
    // fonction split pour recuperer tout apres l'espace dans le header
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');// verify pour decoder le token
    const userId = decodedToken.userId;// on extrait l'id utilisateur
    if (req.body.userId && req.body.userId !== userId) { // si la demande contient id utilisateur, comparasion avec celui extrait du token
      throw 'Invalid user ID';
    } else { // tout fonctionne l'utilisateur est authentifier
      next(); // passe l'execution
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

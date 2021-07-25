const multer = require('multer');// package permettant de gerer les fichiers entrants dans les requetes HTTP

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // constante storage comme configuration
  destination: (req, file, callback) => {
    callback(null, 'images');// indique à multer d'enregistrer les fichiers dans le dossier image
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // utilise le nom d'origine en remplacant les espaces par des _
    const extension = MIME_TYPES[file.mimetype]; // resoud l'extension de fichier appropriée
    callback(null, name + Date.now() + '.' + extension);// ajout d'un timestamp comme nom de fichier
  }
});

//export de l'élément multer configuré avec sa constante storage. Gere uniquement le téléchargement de fichiers image
module.exports = multer({storage: storage}).single('image');
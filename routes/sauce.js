const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // import du middleware
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');

// middleware en argument dans nos routes pour verifier l'authentification (protection des routes)
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
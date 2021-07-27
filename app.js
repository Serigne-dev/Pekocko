const express = require('express');//framework facilitant la creation et gestion du serveur node
const app = express();
const bodyParser = require('body-parser');// package permettant d'extraire l'objet json d'une demande post
const cors = require('cors');// partage des ressources entre origines multiples, protege des appel depuis une origine differente
const mongoose = require('mongoose');// import de mongoose
const path = require('path');// pour acceder au path d serveur
const helmet = require('helmet') // import de helmet
var sixtyDaysInSeconds = 5184000;
const userRoutes = require("./routes/user"); // importe le routeur user
const saucesRoutes = require("./routes/sauce"); // importe le routeur sauce
const session = require('cookie-session')
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

// Connection au service MangoDB
require('dotenv').config(); // Pour masquer le mot de passe

mongoose.connect(process.env.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//connection à la base de donnée
mongoose.connect('mongodb+srv://SerigneDiongue:SerigneDiongue@cluster0.vclia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(cors());
app.use(bodyParser.json());// definit la fonction json de body parser pour l'application
app.use(helmet.xssFilter()); //Le middleware modifie la requête en y incluant l’en-tête X-XSS-Protection
app.use(helmet.frameguard({ action: 'deny' })); //Anti-click jacking
app.use(helmet.hsts({maxAge: sixtyDaysInSeconds})); // protection des communications
app.use("/api/auth", userRoutes);// enregistrement de la route user
app.use("/images", express.static(path.join(__dirname, "images")));// gere la ressource image de maniere statique
app.use("/api/sauces", saucesRoutes);// enregistrement de la route sauce
app.use(session({
          name: 'toto',
          keys: ['key1', 'key2'],
          cookie: {

                      secure: true,

                      httpOnly: true,

                      path: 'foo/bar',

                      expires: expiryDate

                    }}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

module.exports = app;
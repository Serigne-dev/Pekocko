const express = require('express');//framework facilitant la creation et gestion du serveur node
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet')
var sixtyDaysInSeconds = 5184000;
const userRoutes = require("./routes/user"); // importe le routeur user
const saucesRoutes = require("./routes/sauce"); // importe le routeur sauce

mongoose.connect('mongodb+srv://SerigneDiongue:SerigneDiongue@cluster0.vclia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors());

app.use(bodyParser.json());
app.use(helmet.xssFilter()); //Le middleware modifie la requête en y incluant l’en-tête X-XSS-Protection
app.use(helmet.frameguard({ action: 'deny' })); //Anti-click jacking
app.use(helmet.hsts({maxAge: sixtyDaysInSeconds})); // protection des communications
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);


module.exports = app;
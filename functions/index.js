const bodyParser = require('body-parser');
const uuid = require('uuid');
const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const dt = require('./systems/check-firma');

const firebaseConfig = {
  apiKey: "AIzaSyCMIMeI5KzNVLr7zQYlaIZYudhChiW4uU0",
  authDomain: "hesapci-6e9c0.firebaseapp.com",
  databaseURL: "https://hesapci-6e9c0.firebaseio.com",
  projectId: "hesapci-6e9c0",
  storageBucket: "hesapci-6e9c0.appspot.com",
  messagingSenderId: "353952758700"
};

var serviceAccount = require("./hesapci-6e9c0-firebase-adminsdk-nkn7c-a16b2e3215.json");

const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://hesapci-6e9c0.firebaseio.com"
});

function getFacts() {
  const ref = firebaseApp.database().ref('facts');
  return ref.once('value').then(snap => snap.val());
}

function getFirmas() {
  const ref = firebaseApp.database().ref('firma');
  return ref.once('value').then(snap => snap.val());
}

function getKullanicis() {
  const ref = firebaseApp.database().ref('kullanici');
  return ref.once('value').then(snap => snap.val());
}

function getLogin() {
  var defaultAuth = firebaseApp.auth();
  var defaultDatabase = firebaseApp.database();
  console.log("--------------> "+firebase.app().name);// "default"

  defaultAuth.getUserByEmail("an80x86@gmail.com")
    .then(function(userRecord) {
      console.log("Successfully fetched user data:", userRecord.uid);// .toJSON());
    })
    .catch(function(error) {
      console.log("Error fetching user data:", error);
    });
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.get('/', (request, response) => {
  var token = request.param('token');
  if (!token) {
    response.redirect('/login')
    return;
  }

  console.log("üretilen-no--->" + uuid.v1());
  console.log("token--->" + token);
  //getLogin();
  //listAllUsers();
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getFacts().then(facts => {
    response.render('index', { facts });
  });
});

app.get('/login', (request, response) => {
  response.render('login');
});

app.post('/login', function(req, res) {
  var firma = req.body.firma;
  var name = req.body.name;
  var password = req.body.password;

  console.log(firma + ' ' + name + ' ' + password);
  res.send(firma + ' ' + name + ' ' + password);
});

app.get('/test', (request, response) => {
  const db = firebaseApp.database();
  dt.getFirmaKontrol(response, db, "arnege","user@arnege.com","1122");
});

app.get('/firma', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getFirmas().then(facts => {
    response.render('firma', { facts });
  });
});

app.get('/kullanici', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getKullanicis().then(facts => {
    response.render('kullanici', { facts });
  });
});

app.get('/facts.json', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getFacts().then(facts => {
    response.json(facts);
  });
});

exports.app = functions.https.onRequest(app);

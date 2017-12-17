const fs = require('fs');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const dt = require('./systems/check-firma');
const td = require('./systems/tedarikci');

const firebaseConfig = {
  apiKey: "AIzaSyCMIMeI5KzNVLr7zQYlaIZYudhChiW4uU0",
  authDomain: "hesapci-6e9c0.firebaseapp.com",
  databaseURL: "https://hesapci-6e9c0.firebaseio.com",
  projectId: "hesapci-6e9c0",
  storageBucket: "hesapci-6e9c0.appspot.com",
  messagingSenderId: "353952758700"
};

var serviceAccount = require("./hesapci-6e9c0-firebase-adminsdk-nkn7c-a16b2e3215.json");

const firebaseApp = firebase.initializeApp({credential: firebase.credential.cert(serviceAccount), databaseURL: "https://hesapci-6e9c0.firebaseio.com"});

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
  console.log("--------------> " + firebase.app().name); // "default"

  defaultAuth.getUserByEmail("an80x86@gmail.com").then(function(userRecord) {
    console.log("Successfully fetched user data:", userRecord.uid); // .toJSON());
  }).catch(function(error) {
    console.log("Error fetching user data:", error);
  });
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.engine('hbs', engines.handlebars);
//app.set('views', './views');
//app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/inst', (request, response) => {
  const db = firebaseApp.database();
  dt.ilkKayitOlustur(db);
  response.redirect('/login');
});

// tedarikci //////////////////////////////////
app.get('/tedarikci', (request, response) => {
  const db = firebaseApp.database();
  var token = request.query.token;
  if (!token) {
    response.redirect('/login')
    return;
  }
  const sonuc = dt.checkToken(db, token).then(gelen => {
    if (!gelen) {
      response.redirect('/login');
    } else {
      if (token != gelen.token) {
        response.redirect('/login');
      } else {
        td.getTedariks(db,token).then(facts => {
          console.log("Ayse : " + facts);
          response.render('tedarikci', {facts});
        });
      }
    }
  });
});

///////////////////////////////////////////////

app.get('/', (request, response) => {
  const db = firebaseApp.database();
  var token = request.query.token;
  if (!token) {
    response.redirect('/login')
    return;
  }
  const sonuc = dt.checkToken(db, token).then(gelen => {
    //console.log("gelen data:" + JSON.stringify(gelen));
    if (!gelen) {
      response.redirect('/login');
    } else {
      if (token != gelen.token) {
        response.redirect('/login');
      } else {
        getFacts().then(facts => {
          response.render('index', {facts, gelen});
        });
      }
    }
  });
});

app.get('/siparis', (request, response) => {
  const db = firebaseApp.database();
  var token = request.query.token;
  if (!token) {
    response.redirect('/login')
    return;
  }
  const sonuc = dt.checkToken(db, token).then(gelen => {
    //console.log("gelen data:" + JSON.stringify(gelen));
    if (!gelen) {
      response.redirect('/login');
    } else {
      if (token != gelen.token) {
        response.redirect('/login');
      } else {
        getFacts().then(facts => {
          response.render('siparis', {facts, gelen});
        });
      }
    }
  });
});

app.get('/login', (request, response) => {
  response.render('login');
});

app.post('/login', function(req, res) {
  const db = firebaseApp.database();
  var firma = req.body.firma;
  var name = req.body.name;
  var password = req.body.password;
  dt.getFirmaKontrol(res, db, firma, name, password);
});

///////////////////////////////////////////////////////////////////////////

app.get('/test', (request, response) => {
  const db = firebaseApp.database();
  dt.getFirmaKontrol(response, db, "arnege", "user@arnege.com", "1122");
});

app.get('/firma', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getFirmas().then(facts => {
    response.render('firma', {facts});
  });
});

app.get('/kullanici', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getKullanicis().then(facts => {
    response.render('kullanici', {facts});
  });
});

app.get('/facts.json', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getFacts().then(facts => {
    response.json(facts);
  });
});

exports.app = functions.https.onRequest(app);

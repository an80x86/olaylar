const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

function getFacts() {
  const ref = firebaseApp.database().ref('facts');
  return ref.once('value').then(snap => snap.val());
}

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.get('/', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getFacts().then(facts => {
    response.render('index', { facts });
  });
});

app.get('/facts.json', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getFacts().then(facts => {
    response.json(facts);
  });
});

exports.app = functions.https.onRequest(app);

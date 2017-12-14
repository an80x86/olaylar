const uuid = require('uuid');

function ilkKayitOlustur(db) {
  //firma kayıt oluştur
  var newPostRef = db.ref('firma').push();
  newPostRef.set({
    ad: "arnege"
  });
  newPostRef = db.ref('firma').push();
  newPostRef.set({
    ad: "test"
  });

  // kullanici olustur
  const firma = db.ref('firma').once('value');
  firma.then(snap => {
    snap.forEach(function(data) {

      var newPostRef = db.ref('kullanici').push();
      newPostRef.set({
        firma: data.key,
        kullanici: "user@" + data.val().ad + ".com",
        sifre: "1122",
        token: ""
      });
    });
  });
}

function getFirmaKontrol(response, db, fname, uname, upass) {
  const firma = db.ref('firma').once('value');
  const kullanici = db.ref('kullanici').once('value');
  var yaz = "?";

  return Promise.all([firma, kullanici]).then(res => {
    console.log("firma : " + JSON.stringify(res[0].val()));
    console.log("kullanici : " + JSON.stringify(res[1].val()));


    var e1 = "?"
    for (var i = 0; i < res[0].val().length; i++) {
      if (res[0].val()[i].ad === fname) {
        e1 = res[0].val()[i].id.toString();
      }
    }

    var e2 = "?"
    for (var i = 0; i < res[1].val().length; i++) {
      console.log("donen : " + res[1].val()[i].firma.toString() + " -- " + e1);
      if (
        res[1].val()[i].firma.toString() === e1 &&
        res[1].val()[i].kullanici === uname &&
        res[1].val()[i].sifre.toString() === upass) {
        e2 = "ok";
      }
    }

    yaz = e1 + " -- " + e2 + " -- " + uuid.v1();
  }).then(x => {
    response.send(yaz);
  });
}

exports.getFirmaKontrol = getFirmaKontrol;
exports.ilkKayitOlustur = ilkKayitOlustur;

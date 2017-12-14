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
    var e1 = "?"
    var e2 = "?"
    var e3 = "?";

    res[0].forEach(function(data) {
      if (data.val().ad === fname) {
        e1 = data.key;
        console.log("buldu(1)!.. " + e1);
      }
    });

    res[1].forEach(function(data) {
      if (
        data.val().firma.toString() === e1 &&
        data.val().kullanici === uname &&
        data.val().sifre.toString() === upass) {
        e2 = data.key;
        console.log("buldu(2)!.. " + e2);
      }
    });

    if (e1 !== '?' && e2 !== '?') {
      e3 = uuid.v1();
      var hopperRef = db.ref('kullanici/'+e2);
      hopperRef.update({
        "token": e3
      });
    }

    yaz = e3;//e1 + " -- " + e2 + " -- " + e3;
  }).then(x => {
    response.redirect('/?token=' + yaz);
    //response.send(yaz);
  });
}

exports.getFirmaKontrol = getFirmaKontrol;
exports.ilkKayitOlustur = ilkKayitOlustur;

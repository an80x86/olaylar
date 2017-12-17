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
        kullanici: "admin@" + data.val().ad + ".com",
        sifre: "1122",
        admin: true,
        token: ""
      });
    });
  });
}

function checkToken(db, token) {
  const kullanici = db.ref('kullanici').child(token).once('value');
  var yaz = {token:'?', admin:false, kullanici:''};

  return Promise.all([kullanici]).then(res => {
    if (res[0].val()) { // null degil ise oku!.
      yaz.token = res[0].val().token;
      yaz.admin = res[0].val().admin;
      yaz.kullanici = res[0].val().kullanici;
    }
  }).then(x => {
    return yaz;
  });
}

function getFirmaKontrol(response, db, fname, uname, upass) {
  const firma = db.ref('firma').once('value');
  const kullanici = db.ref('kullanici').once('value');
  var yaz = "?";

  return Promise.all([firma, kullanici]).then(res => {
    var e1 = "?"
    var e2 = "?"

    res[0].forEach(function(data) {
      if (data.val().ad === fname) {
        e1 = data.key;
      }
    });

    res[1].forEach(function(data) {
      if (
        data.val().firma.toString() === e1 &&
        data.val().kullanici === uname &&
        data.val().sifre.toString() === upass) {
        e2 = data.key;
      }
    });

    if (e1 !== '?' && e2 !== '?') {
      var hopperRef = db.ref('kullanici/'+e2);
      hopperRef.update({
        "token": e2
      });
    }

    yaz = e2;
  }).then(x => {
    if (yaz==='?') {
      var hata = "Kullanıcı adı veya şifreniz hatalı!";
      response.render('login',{hata});
    } else {
      response.redirect('/?token=' + yaz);
    }
  });
}

exports.getFirmaKontrol = getFirmaKontrol;
exports.ilkKayitOlustur = ilkKayitOlustur;
exports.checkToken = checkToken;

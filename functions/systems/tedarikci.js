function ilkKayitOlustur(db, token) {
  //firma kayıt oluştur
  var newPostRef = db.ref('tedarikci/'+token).push();
  newPostRef.set({
    firma: "arnege",
    unvan: "fatih",
    kategori: "yok",
    mail: "f@at.ih",
    telefon: "542-4442",
    faks: "yok",
    il: "istanbul",
    ilce: "ümraniye",
    tur: "yok"
  });
}

function getTedariks(firebaseApp,id) {
  const ref = firebaseApp.ref('tedarikci/'+id);
  return ref.once('value').then(snap => snap.val());
}

exports.getTedariks = getTedariks;
exports.ilkKayitOlustur = ilkKayitOlustur;

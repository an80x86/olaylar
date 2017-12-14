var myDateTime = function() {
  return Date();
};

function getFirmaKontrol(facts, firma) {
  var sonuc = "-1"
  for(i=0;i<facts.length;i++) {
    ///console.log("----> " + facts[i]);
    if (facts[i].ad === firma) sonuc = facts[i].id.toString();
  }
  return sonuc;
}


exports.myDateTime = myDateTime;
exports.getFirmaKontrol = getFirmaKontrol;

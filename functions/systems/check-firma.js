var myDateTime = function () {
    return Date();
};


var getFirmaKontrol  = function(ref, firma) {
  var don = "-1";
  var obj = ref.once('value').then(snap => snap.val());

  obj.then(facts => {

    facts.forEach(function (fact) {
      console.log(fact.ad + " <---> " + firma);
      if (fact.ad === firma) {
        don = fact.id.toString();
        console.log("buldu!... " + don);
      }
    });
  });

  return don;
}

exports.myDateTime = myDateTime;
exports.getFirmaKontrol = getFirmaKontrol;

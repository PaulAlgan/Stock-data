var MongoClient = require('mongodb').MongoClient
var pharser = require('./pharser');

// Connection url
// var url = 'mongodb://10.0.1.6:27017/db1';
var url = 'mongodb://128.199.215.170:27017/db1';



// Connect using MongoClient
function connectDb(callback){
  MongoClient.connect(url, function(err, db) {
    var stockCollection = db.collection('stocks');
    callback(stockCollection);
  });
}


connectDb( function(stockCollection){
  // var rangeDailyVol = [];
  // rangeDailyVol.push( { "DailyBuyVolume": { $gte: "17995300" } } )
  // rangeDailyVol.push( { "DailyBuyVolume": { $lte: "18005300" } } )
  //
  // var rangeDate = [];
  // rangeDate.push( { "TradeDate": {$gt: 1429608582866} } );
  // rangeDate.push( { "TradeDate": {$lte: 1429608599604} } );
  //
  stockCollection.find({ }).count(function(err, docs) {
    console.log(docs);

    // for (var i = 0; i < docs.length; i++) {
    //   var tick = docs[i];
    //   console.log(tick['ExchangeDailyDate']);
    // }

  });

  pharser.openFile('./JAS.txt', function (err,tickArray){
    for (var i = 0; i < tickArray.length; i++) {
      var tickData = tickArray[i];
      insert(tickData);
    }
  })
  //
  // function insert(tickData) {
    // stockCollection.insert (
    //   [ tickData ],
    //   function(err,result) {
    //     console.log(tickData.ExchangeDailyDate);
    //   })
    // }

});

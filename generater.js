var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://128.199.215.170:27017/db1';

var moment = require('moment');
var pharser = require('./pharser');

connectDb();

function connectDb(callback){
  MongoClient.connect(url, function(err, db) {
    var tick1minCollection = db.collection('tick_1min');
    var tickDict = {};
    var tickReduceList = [];


    pharser.openFile('./ARROW.txt', function (err,tickArray){
      var openDate = moment(tickArray[0].TradeDate);
      var lastHr=openDate.hour(), lastMin=openDate.minute();

      var temp = [];
      temp.push(tickArray[0]);
      for (var i = 1; i < tickArray.length; i++) {
        var date = moment(tickArray[i].TradeDate);
        var currHr = date.hour(), currMin = date.minute();
        if (currHr !== lastHr || currMin !== lastMin) {
          var tick = reduceTick(temp);
          // console.log(tick);
          temp = [];
          tickReduceList.push(tick);
          tickDict[tick.hr+':'+tick.min] = tick;
        }
        temp.push(tickArray[i]);
        lastHr = currHr;
        lastMin = currMin;
      }

      var prevTick = tickReduceList[0];
      var count = 1;
      for (var hr=9; hr<=16; hr++){
        var startMin = 0;
        if (hr === 9) startMin = 55;
        for (min=startMin; min<=59; min++){
          var key = hr+':'+min;
          var tick = tickDict[key];
          count++;
          if (!tick){
            var utc = moment(prevTick.time);
            var date = utc.format('YYYY-MM-DD');
            date = date + " " + hr + ':' + min;
            var noSecondDate = moment(date,'YYYY-MM-DD HH:mm').utc().valueOf();

            tick = JSON.parse(JSON.stringify(prevTick));
            tick.volume = 0;
            tick.time = noSecondDate;
          }
          else{
            prevTick = tick;
          }
          console.log(key, count);
          insertTickDataToDb(tick);
        }
      }

    })




    function insertTickDataToDb(data){
      var tick = JSON.parse(JSON.stringify(data));
      delete tick.hr;
      delete tick.min;
      tick1minCollection.insert (
        [ tick ],
        function(err,result) {
          if (err) {
            console.log(err);
          }
          else{
            console.log('.');
          }
        })
    }


  });
}

function reduceTick(array){
  var volume, open, low, high, close;

  var firstTick = array[0];
  var lastTick = array[array.length-1];

  var utc = moment(firstTick.ExchangeDailyDate);
  var date = utc.format('YYYY-MM-DD HH:mm');
  var noSecondDate = moment(date,'YYYY-MM-DD HH:mm').utc().valueOf();


  var sum = 0;
  low = high = Number(firstTick.Price);
  array.forEach(function(tick){
    var price = Number(tick.Price);
    sum += Number(tick.TradeVolume);
    if (price < low) low = price;
    if (price > high) high = price;
  })
  volume = sum;

  open = Number(firstTick.Price);
  close = Number(lastTick.Price);

  var tickData = {};
  tickData.symbol = firstTick.symbol;
  tickData.open = open;
  tickData.close = close;
  tickData.low = low;
  tickData.high = high;
  tickData.volume = volume;
  tickData.time = noSecondDate;
  tickData.hr = utc.hour();
  tickData.min = utc.minute();
  return tickData;
}

function insertToDb(tickData){
  console.log(tickData);
}

var moment = require('moment');
var pharser = require('./pharser');


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
      insertToDb(tick);
      temp = [];
    }
    temp.push(tickArray[i]);
    lastHr = currHr;
    lastMin = currMin;
  }
})

function reduceTick(array){
  var volume, open, low, high, close;

  var firstTick = array[0];
  var lastTick = array[array.length-1];

  var date = moment(firstTick.ExchangeDailyDate).format('YYYY-MM-DD HH:mm');
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
  return tickData;
}

function insertToDb(tickData){
  console.log(tickData);
}

var moment = require('moment');
var pharser = require('./pharser');


pharser.openFile('./JAS.txt', function (err,tickArray){
  var openDate = moment(tickArray[0].TradeDate);
  var lastHr=openDate.hour(), lastMin=openDate.minute();

  var temp = [];
  for (var i = 1; i < tickArray.length; i++) {
    // console.log(tickArray[i]);
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
  var sum = 0;
  array.forEach(function(tick){
    sum += Number(tick.TradeVolume);
  })

  // Open
  // Price
  // return "Open: " + first.Open + "  Close: " + last.Price;
  // TradeVolume
  return "TradeVolume: "+sum;
}

function insertToDb(tickData){
  console.log(tickData);
}

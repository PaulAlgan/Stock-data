var fs = require('fs');
var moment = require('moment');

function openFile (filePath, callback){
  fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
    if (!err) {
      var array = textToArray(data);
      var tickArray = [];

      for (var i = 0; i < array.length; i++) {
        var object = textToObject(array[i]);
        if (object !== null) tickArray.push(object);
      }
      callback(null, tickArray);
    }
    else{
      console.log('Open file error:',err);
    }
  });
}

function textToArray(string){
  var array = string.split('\n\r\n');
  return array;
}

function textToObject(string){
  var array = string.split(' ');
  var object = {};

  for(var i=0; i<array.length; i++){
    var record = array[i];
    if (record.length > 1) {
      var recordArray = record.split(':');
      var key = recordArray[0];

      if (key === 'ExchangeDailyDate' || key === 'TradeDate') {
        var time = array[i+1];
        var ampm = array[i+2];

        var dateTime = recordArray[1]+'T'+time+ampm;
        var timestamp = moment(dateTime, 'MM/DD/YYYYTHH:mm:ss.SSSA');
        var isoDateFormat = timestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ')

        object[key] = isoDateFormat;
      }
      else{
        if (recordArray.length === 2) {
          if (recordArray[1] === 'True') {
            object[recordArray[0]] = true;
          }
          else if (recordArray[1] === 'False'){
            object[recordArray[0]] = false;
          }
          else{
            object[recordArray[0]] = recordArray[1];
          }

        }
      }
    }
  }

  if (array.length < 10) return null;
  return object;
}


openFile('/Users/phatthana/Dropbox/iOS Dev/Stock/JAS.txt', function(err, tickArray){
  // console.log('ERROR:', err);
  // console.log('TICK:', tickArray[10]);

  // console.log(tickArray[6].ExchangeDailyDate);

});

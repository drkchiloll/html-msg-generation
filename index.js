var config = require('./config');
var Spark = require('csco-spark')({
  uri:'https://api.ciscospark.com/v1',
  token: config.token
});
var roomid = config.room;

var sparkMsgs = [];
var finalArray = [];
Spark.listItemEvt({
  item: 'messages',
  roomId: roomid,
  max: 50
}).on('messages', resp => {
  sparkMsgs.push(resp);
}).on('end', resp => {
  sparkMsgs.push(resp);

  finalArray = sparkMsgs.reduce((arr, sparkMsgArr) => {
    arr = arr.concat(sparkMsgArr);
    return arr;
  }, finalArray);

  console.log(finalArray);
})

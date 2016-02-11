var Promise = require('bluebird'),
    config = require('./config'),
    Spark = require('csco-spark')({
      uri:'https://api.ciscospark.com/v1',
      token: config.token
    }),
    roomid = config.room;

var handleSprkList = (item) => {
  var tempArr = [];
  return new Promise((resolve, reject) => {
    Spark.listItemEvt({
      item: item,
      roomId: roomid,
      max: 100
    }).on(item, resp => {
      tempArr.push(resp);
    }).on(`${item}-end`, resp => {
      tempArr.push(resp);
      return resolve(tempArr);
    })
  })
};

var handleArrArr = (arrArr) => {
  // Reduce the Array of Arrays to a Single Array
  return arrArr.reduce((array, arr) => {
    array = array.concat(arr);
    return array;
  });
};

var sparkMsgs = [],
    roomMembers = [];

handleSprkList('messages').then((arrarr) => {
  //Handle Array of Arrays
  sparkMsgs = handleArrArr(arrarr);
  return;
}).then(() => {
   return handleSprkList('memberships').then((arrarr) => {
     roomMembers = handleArrArr(arrarr);
     return;
   })
}).then(() => {
  console.log(sparkMsgs);
  console.log(roomMembers);
});

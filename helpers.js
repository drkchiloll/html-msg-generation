var Promise = require('bluebird');

exports.handleSprkList = (Spark, item) => {
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
    });
  });
};

exports.handleArrArr = (arrArr) => {
  // Reduce the Array of Arrays to a Single Array
  return arrArr.reduce((array, arr) => {
    array = array.concat(arr);
    return array;
  });
};

exports.handleEmails = (members) => members
  .filter(member => member.personEmail)
  .reduce((arr, member) => {
    arr.push(member.personEmail);
    return arr;
  },[]);

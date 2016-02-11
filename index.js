var utils = require('./helpers');
    config = require('./config'),
    Spark = require('csco-spark')({
      uri:'https://api.ciscospark.com/v1',
      token: config.token
    }),
    roomid = config.room;

var sparkMsgs = [],
    roomMembers = [];

// utils.contactPanel(null);

utils.handleSprkList(Spark, 'messages').then((arrarr) => {
  //Handle Array of Arrays
  sparkMsgs = utils.handleArrArr(arrarr);
  return;
}).then(() => {
   return utils.handleSprkList(Spark, 'memberships').then((arrarr) => {
     roomMembers = utils.handleArrArr(arrarr);
     return;
   })
}).then(() => {
  // console.log(sparkMsgs);
  roomMembers = utils.handleEmails(roomMembers);
  utils.contactPanel(roomMembers);

});

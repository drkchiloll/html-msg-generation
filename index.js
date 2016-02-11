var utils = require('./helpers');
    config = require('./config'),
    Spark = require('csco-spark')({
      uri:'https://api.ciscospark.com/v1',
      token: config.token
    }),
    roomid = config.room;

var sparkMsgs = [],
    roomMembers = [],
    memPanel, roomTitle;

// utils.contactPanel(null);

utils.handleSprkList(Spark, 'messages').then((arrarr) => {
  //Handle Array of Arrays
  sparkMsgs = utils.handleArrArr(arrarr);
  return;
}).then(() => {
   return utils.handleSprkList(Spark, 'memberships').then((arrarr) => {
     roomMembers = utils.handleArrArr(arrarr);
     roomMembers = utils.handleEmails(roomMembers);
     return;
   })
}).then(() => {
  // console.log(sparkMsgs);
  return Spark.getRoom(roomid);
}).then((room) => {
  // Process the Top-Level Panel
  roomTitle = room.title;
  memPanel = utils.contactPanel(roomTitle, roomMembers);

  console.log(utils.msgPanel(memPanel, sparkMsgs));
})

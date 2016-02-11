var Promise = require('bluebird'),
    moment = require('moment'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    pdf = require('html5-to-pdf');

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

exports.contactPanel = (roomTitle, contacts) => {
  var $ = cheerio.load(fs.readFileSync('index.html'));
  $('h3#title').text(roomTitle);
  var tdata = $('tbody#tblbody');
  contacts.forEach(contact => {
    tdata.append(`<tr><td>${contact}</td></tr>`);
  });
  return $.html();
};

exports.msgPanel = (html, messages) => {
  var dtFormat = 'l LT',
      $ = cheerio.load(html),
      msgBody = $('div#msgbody');
  messages.forEach(msg => {
    if(msg.text) {
      msgDt = new Date(msg.created);
      msgBody.append(
        `<p><strong>${msg.personEmail}</strong> ${moment(msgDt).format(dtFormat)}`+
        `<p>${(msg.text).includes('\n') ? msg.text.replace(/\n/gi, '<br/>') : msg.text}<p>`+
        `<hr>`
      );
    }
  });
  return $.html();
};

exports.htmlToPdf = (title, html) => {
  pdf({
    cssPath: './node_modules/bootstrap/dist/css/bootstrap.css'
  }).from.string(html).to(`./${title}.pdf`, () => {
    console.log('finished');
  })
};

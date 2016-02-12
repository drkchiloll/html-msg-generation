var Promise = require('bluebird'),
    moment = require('moment'),
    cheerio = require('cheerio'),
    pdf = require('html5-to-pdf'),
    fs = require('fs');

module.exports = (() => {
  var helpers = {};

  helpers.handleEmails = (members) => members
    .filter(member => member.personEmail) //Member has an Email
    .reduce((arr, member) => {
      arr.push(member.personEmail);
      return arr;
    }, []); // Return List of Members Email Address

  helpers.contactPanel = (roomTitle, contacts) => {
    var $ = cheerio.load(fs.readFileSync('index.html'));
    $('h3#title').text(roomTitle);
    var tdata = $('tbody#tblbody');
    contacts.forEach(contact => {
      tdata.append(`<tr><td>${contact}</td></tr>`);
    });
    return $.html(); //HTML as a String
  };

  helpers.msgPanel = (html, msges) => {
    var dtFormat = 'l LT',
        $ = cheerio.load(html),
        msgBody = $('div#msgbody');
    msges.forEach(msg => {
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

  helpers.htmlToPdf = (title, html) => {
    pdf({
      cssPath: './node_modules/bootstrap/dist/css/bootstrap.css'
    }).from.string(html).to(`./${title}.pdf`, () => {
      console.log('finished');
    })
  };

  helpers.handleSprkList = (Spark, item) => {
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

  helpers.handleArrArr = (arrArr) => {
    // Reduce the Array of Arrays to a Single Array
    return arrArr.reduce((array, arr) => {
      array = array.concat(arr);
      return array;
    });
  };

  helpers.handleEmails = (members) => members
    .filter(member => member.personEmail)
    .reduce((arr, member) => {
      arr.push(member.personEmail);
      return arr;
    },[]);

  return helpers;
})();

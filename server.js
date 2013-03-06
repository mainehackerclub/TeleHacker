// Twilio Powered App
var Telenode = require('telenode'),
    creds = require('./credentials')['twilio'];

var client = new Telenode(Telenode.providers.twilio);

client.credentials(creds);

var destination = process.argv[2],
    message = process.argv[3];

console.log('dest: ' + destination + ' msg: ' + message);

function smsHandler(err, body) {
  if (err) throw err;
  console.log('Body: ' + body);
}

client.SMS.send(
  {
    from: '+1-857-264-3800',
    to: destination,
    body: message
  },smsHandler
);

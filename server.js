// Twilio Powered App
var Telenode = require('telenode'),
    creds = require('./credentials')['twilio'],
    winston = require('winston'),
    static = require('node-static'),
    fileServer = new static.Server('.'),
    http = require('http');

// Winston logging setup.
var logger = new winston.Logger,
  options = {timestamp:true};
  logger.add(winston.transports.Console, options);

logger.info('Starting TeleHacker');
var port = 1340;
var server = http.createServer(function(req,res) {
  logger.info('HTTP '+req.method+' '+req.url); 
  if  (req.url === '/Incoming/Call') {
    if (req.method === 'GET') {
      fileServer.serveFile('./twiml/recordCall.xml', 200, {}, req, res);
      logger.info('Incoming call received.');
    } else if (reg.method === 'POST') {
      logger.info('Incoming call completed.'+ req.body);
    }
  } else {
    static.serve(req,res);
  }
}).listen(port);

/* Twilo SMS setup.
var client = new Telenode(Telenode.providers.twilio);
client.credentials(creds);

function smsHandler(err, body) {
  if (err) throw err;
  console.log('Body: ' + body);
}

var destination = process.argv[2],
    message = process.argv[3];

console.log('dest: ' + destination + ' msg: ' + message);
client.SMS.send(
  {
    from: '+1-857-264-3800',
    to: destination,
    body: message
  },smsHandler
);
*/


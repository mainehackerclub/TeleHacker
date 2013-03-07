// Twilio Powered App
var Telenode = require('telenode'),
    creds = require('./credentials')['twilio'],
    winston = require('winston'),
    util = require('util'),
    static = require('node-static'),
    fileServer = new static.Server('.'),
    url  = require('url'),
    http = require('http');

// Winston logging setup.
var logger = new winston.Logger,
  options = {timestamp:true};
  logger.add(winston.transports.Console, options);

// Twilo SMS setup.
var client = new Telenode(Telenode.providers.twilio);
client.credentials(creds);

function smsHandler(err, body) {
  if (err) throw err;
  console.log('Body: ' + body);
}

// This HTTP server listens for GET & POST requests from Twilio.
logger.info('Starting TeleHacker');
var port = 1340;
var server = http.createServer(function(req,res) {
  var parsedUrl = url.parse(req.url,true);
  logger.info('HTTP '+req.method+' '+parsedUrl.pathname); 
  if  (parsedUrl.pathname === '/Incoming/Call') {
    if (req.method === 'GET') {
      fileServer.serveFile('./twiml/recordCall.xml', 200, {}, req, res);
      if (parsedUrl.query != '') {
        logger.info('Call details:\n'+util.inspect(parsedUrl.query));
        var message = 'From ' + parsedUrl.query.From + '\nCallStatus ' +
                      parsedUrl.query.CallStatus + '\nCallerCity ' +
                      parsedUrl.query.CallerCity + '\nCallerName ' +
                      parsedUrl.query.CallerName;
        client.SMS.send(
          {
            from: creds.from,
            to: creds.to,
            body: message
          },smsHandler
        );
        logger.info('SMS Message: '+message);
      }
    } else if (req.method === 'POST') {
      logger.info('Incoming call completed.');
      res.statusCode = 200;
      res.end();
    }
  } else {
    fileServer.serve(req,res);
  }
}).listen(port);


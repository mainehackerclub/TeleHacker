// Twilio Powered App
var Telenode = require('telenode'),
    creds = require('./credentials')['twilio'],
    winston = require('winston'),
    util = require('util'),
    static = require('node-static'),
    fileServer = new static.Server('.'),
    url  = require('url'),
    querystring  = require('querystring'),
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

function makeSms(twinfo) {
  var message = 'From ' + twinfo.From + '\nStatus ' +
		twinfo.CallStatus + '\nCity ' +
		twinfo.CallerCity + '\nName ' +
		twinfo.CallerName;
  return message;
}

function sendAlertSms(twinfo) {
  var message = makeSms(twinfo);
  client.SMS.send(
    {
      from: creds.from,
      to: creds.to,
      body: message
    },smsHandler
  );
  logger.info('SMS Message: '+message);
}

function postHandler(req,query) {
      logger.info('Call details:\n'+util.inspect(query));
      res.statusCode = 200;
      res.end();

      //Process Request Body.
      req.addListener('data', function(chunk) {
        req.content += chunk;
      });
      req.addListener('end', function(chunk) {
      if (req.content != '') {
        var qs = querystring.parse(req.content);
        logger.info('Parsed Request data:\n'+util.inspect(qs));
        sendAlertSms(qs);
      }
    });
}

// This HTTP server listens for GET & POST requests from Twilio.
logger.info('Starting TeleHacker');
var port = 1340;
var server = http.createServer(function(req,res) {
  req.setEncoding('utf8');
  req.content= '';

  var parsedUrl = url.parse(req.url,true);
  logger.info('HTTP '+req.method+' '+parsedUrl.pathname); 

  if  (parsedUrl.pathname === '/Incoming/Call') {
    if (req.method === 'GET') {
      fileServer.serveFile('./twiml/recordCall.xml', 200, {}, req, res);
      if (parsedUrl.query != '') {
        logger.info('Call details:\n'+util.inspect(parsedUrl.query));
	sendAlertSms(parsedUrl.query);
      }
    } else if (req.method === 'POST') {
      logger.info('Incoming call completed.');
      postHandler(req,parsedUrl.query);
    }
  } else if (parsedUrl.pathname === '/Incoming/Call/Complete') {
    if (req.method === 'POST') {
      logger.info('Incoming call completed.');
      logger.info('Call details:\n'+util.inspect(parsedUrl.query));
      res.statusCode = 200;
      res.end();
      postHandler(req,parsedUrl.query)
    }
  } else {
    logger.info('Non-supported path, serving static file');
    fileServer.serve(req,res);
  }
}).listen(port);

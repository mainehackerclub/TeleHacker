TeleHacker
==========

This repo will perform different SMS & Voice functions as a practice for our 'public voicemail' civic app.

Currently functionality includes:

1. Receiving voice calls @ `1-857-264-3800`
2. Sending SMS with details of the received voice call.

Twilio setup
------------
[Twilio](http://www.twilio.com) is the provider we're using in this app.  In order to make this code functional, you will need to sign up for a developer account at Twilio.com.  API credentials are read from `credentials.json`.

Usage
-----
* To run the server `node server.js`

Install
-------

* install [node](http://nodejs.org)
* `npm install telenode node-static winston`
* Add your twilio number in the `from` attribute of the `credentials.json` file.
* Add the SMS destination number in the `to` attribute of the `credentials.json` file.

Note
----
The Twilio webservice must be able to contact your server at a publicly accessible web address.  This twilio number is configured to run on [awesomesauce](http://awesomesauce.me)!

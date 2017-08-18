var Alexa = require('alexa-sdk');
//require the request package


exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  // alexa.APP_ID = 'amzn1.ask.skill.458a4a08-6764-4e37-9363-6d054ac4e645';
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask','Hello. Welcome to My Heart Checker.', 'Would you like your current heart rate?');
  },

  'Heartchecker': function() {
    
    var request = require('request');
    //var artistName = this.event.request.intent.slots.artist.value;
    //console.log(artistName);

    //set up variables used in the API request
    var api_key = '';

    //generate the url

    var endpoint ='http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + artistName +'&api_key=' + api_key + '&format=json';
    console.log(endpoint);
    //we're issuing a GEt request here, so we use the get method in th request object

    request.get(endpoint, (error, response, body) => {
        if(response.statusCode != 200){
            this.emit(':tell','There was an error processing your request. Here\'s what happened: ' +
                            response.statusCode + ' ' + response.statusMessage);
        } else {
            console.log(body);
            data = JSON.parse(body);

            //notice the two different ways we can access JSON objects below:
            artist = data["topalbums"]["@attr"]["artist"];
            topalbums = data.topalbums.album;

            //lets sort by playcount in descending order so it makes a little more sense
            topalbums.sort(function(a, b){
                return parseFloat(b.playcount) - parseFloat(a.playcount);
            });
            top = topalbums[0].name;
            //begin to format the output

            console.log('Top album: ' + top);
            
            this.emit(':tell','Here is the top album for ' + artistName + ' based on last.fm play count:' + top);
            
        }  
        
    });
  },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function () {
    this.emit(':ask', `You can tell me the name of a musical artist and I will say it back to you.  Who would you like me to find?`,  `Who would you like me to find?`);
  },
  'Unhandled' : function () {
    this.emit(':ask', `You can tell me the name of a musical artist and I will say it back to you.  Who would you like me to find?`,  `Who would you like me to find?`);
  }

};
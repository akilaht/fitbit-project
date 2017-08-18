var Alexa = require('alexa-sdk');
var request = require('request');
var SESSION_TABLE = process.env.SESSION_TABLE
//require the request package


exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  //alexa.appId = 'amzn1.ask.skill.f611f47c-4fb9-4d80-8f93-8c169e1658b2';
  alexa.dynamoDBTableName = SESSION_TABLE;
  if(event.session.user.accessToken == undefined){
  /*changed made: "from tell to ask" */    alexa.emit(':askWithLinkAccountCard', 'to start using this skill, please use the companion app to authenticate on Amazon. Once authorized say go');
      return;
  }
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    console.log(JSON.stringify(this.event));
    this.emit(':ask','Hello. Welcome to My Heart Checker.');
    
  },
  'HeartChecker': function() {
   
    //var artistName = this.event.request.intent.slots.artist.value;
    //console.log(artistName);

    //set up variables used in the API request
    //var api_key = '';

    //generate the url

    var endpoint ='https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json';
    var options = {
        url: endpoint,
        method: 'GET',
        headers: {
            'Authorization':'Bearer ' + this.event.session.user.accessToken
        }
    };
    console.log(endpoint);
    console.log(options);

    request(options, (error, response, body) => {
        if(response.statusCode != 200){
            this.emit(':tell','There was an error processing your request. Here\'s what happened: ' +
                            response.statusCode + ' ' + response.statusMessage);
        } else {
            console.log(body);
            data = JSON.parse(body);

            //rate = data['activities-heart'][0]['value']['restingHeartRate'];
            //console.log(rate);
            let dataset = data['activities-heart-intraday']['dataset'];
            let last = dataset[dataset.length - 1].value;
            this.emit(':ask','Your most recent heart rate is ' + last, 'To set a reminder, say set reminder');
          
            //notice the two different ways we can access JSON objects below:
            //user_id = data['context']["user"]["userId"];
            //console.log(user_id);
           
        }  
        
    });  
},

  'AppReminder':function (){
    this.emit(':ask', 'What date do you want to set this reminder for?');
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
    this.emit(':ask', `To get your most recent heart rate, tell alexa to go`,  `Say tell me my heart rate to get your latest heart rate`);
  },
  'Unhandled' : function () {
    this.emit(':ask', `I am unable to process your request. Please relaunch the app.`);
  }

};
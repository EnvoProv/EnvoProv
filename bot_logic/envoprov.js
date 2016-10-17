//var SlackBot = require('slackbots');
var data = require("./mockdata.json");
var service = require("./mock_service.js");
var botkit = require("botkit")
var credReady = false;
var options = {
    APIKey: process.env.slackAPIKey
};
var childProcess = require("child_process");

var botcontroller = botkit.slackbot({
    debug: false
});

var botinstance = botcontroller.spawn({
    token: process.env.EnvoProvToken
});


botinstance.startRTM(function(err, bot, payload) {
    if (err) {
        console.error("ERR :" + err);
    }

    if (bot) {
        console.log('Bot initiated');
    }
})

botcontroller.hears(['hi', 'hello'], ['direct_message'], function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
		var name = response.user.name;
		bot.reply(message, "Hi @" +name+" .How can I help you?" );
	});
});


botcontroller.hears(['username','password'], ['mention', 'direct_message'], function(bot, message) {
	credReady = false;
	bot.reply(message, "Thank you! Should I deploy on AWS?");	
});

botcontroller.hears('yes', ['mention', 'direct_message'], function(bot, message) {
	var vm = data.single_vm;
	if(credReady){
		bot.reply(message, "Here it is!\n IP: "+vm.IP+" \nEnvironment: " + vm.Environment);	
	}else{
		bot.reply(message, "Wrong credentials. Please give the correct crdentials");	
	}
});

botcontroller.hears('deploy ', ['mention', 'direct_message'], function(bot, message) {
    var userName ;
	bot.api.users.info({user: message.user}, (error, response) => {
		userName = response.user.name;
		if(service.areCredentialsPresent(userName,data.credentials)){
			bot.reply(message, 'Sure, I have your credentials for Amazon EC2, should I deploy it on AWS?');
		}else{
			bot.reply(message, 'I dont have your credentials. Can you provide them?');
		}
		credReady = true;
	});
});


//var SlackBot = require('slackbots');
var data = require("./mockdata.json");
var service = require("./mock_service.js");
var sys = require('sys')
var shell = require('child_process').exec;

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


var messageQueue = [];


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


botcontroller.hears(['poll'], ['direct_message'], function(bot, message) {
  while (messageQueue.length > 0)
  {
    bot.reply(message, messageQueue.shift());
  }
});

botcontroller.hears(['apache server'], ['direct_message'], function(bot, message) { 
    var awsInstanceCommand = "knife ec2 server create -I ami-2d39803a -f t2.micro --ssh-user ubuntu --region us-east-1 --identity-file ~/.ssh/chef-keypair.pem -r 'recipe[apt], recipe[apache]'"
    shell(awsInstanceCommand, function puts(error, stdout, stderr) { console.log(stderr); messageQueue.push(stdout) });
    bot.reply(message, 'Deploying an apache server for you on AWS, I will get back to you when your instance is ready ...');
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
		bot.reply(message, "Wrong credentials. Please give the correct credentials");	
	}
});

botcontroller.hears('deploy', ['mention', 'direct_message'], function(bot, message) {
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

botcontroller.hears('delete', ['mention', 'direct_message'], function(bot, message) {
	bot.reply(message, 'Provide the ID of the instance that you would like to delete?');
	var userName;
	botcontroller.hears('CL001', ['mention', 'direct_message'], function(bot, message) {

		bot.api.users.info({user: message.user}, (error, response) => {
			userName = response.user.name;

			if(userName==data.instances.CL001.User && data.instances.hasOwnProperty("CL001")){
				bot.reply(message, 'Are you sure you want to delete '+ data.instances.CL001.Name + '?');
				botcontroller.hears(['ok','Ok'], ['mention', 'direct_message'], function(bot, message) {
					bot.reply(message, 'Delete Successful!');
				});
				botcontroller.hears(['No','no'], ['mention', 'direct_message'], function(bot, message) {
					bot.reply(message, 'Ok. Have a great day!');
				});
			}
		});
	});

botcontroller.hears('CL002', ['mention', 'direct_message'], function(bot, message) {

	bot.api.users.info({user: message.user}, (error, response) => {
		userName = response.user.name;

		if(userName==data.instances.CL002.User && data.instances.hasOwnProperty("CL002")){
			bot.reply(message, 'Delete Successful!');
		} else {
			bot.reply(message, 'You do not have access rights for this Instance.');
		}
		});
	});
});

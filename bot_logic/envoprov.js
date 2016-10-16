//var SlackBot = require('slackbots');
var botkit = require("botkit")
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
    console.log('In here');
    bot.reply(message, 'Hi how can I help you!!');
});

botcontroller.on('hello', function(bot, message) {

    console.log("connected!!");

    bot.replyPrivate(message, 'How Can I Help!!!!');
});


botcontroller.hears('you deploy a', ['mention', 'direct_message'], function(bot, message) {
    bot.reply(message, 'Sure, I have your credentials for Amazon EC2, should I deploy it on AWS?');
});

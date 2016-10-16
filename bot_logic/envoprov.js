//var SlackBot = require('slackbots');
var botkit = require("botkit")
var options = {
    APIKey: process.env.slackAPIKey
};
var childProcess = require("child_process");

// create a bot
// var bot = new SlackBot({
//     // Add a bot https://my.slack.com/services/new/bot and put the token
//     token: process.env.EnvoProvToken,
//     name: 'EnvoProv'
// });

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
});

botcontroller.hears('you deply a', ['mention', 'direct_mention'], function(bot, message) {
    bot.reply(message, 'Sure, I have your credentials for Amazon EC2, should I deploy it on AWS?');
});

/*
bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':dog:'
    };

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    // define existing username instead of 'user_name'
    bot.postMessageToUser('garadhy', 'hello', params);
    bot.getChannels().then(function(channels) {
        console.log(JSON.stringify(channels, null, 3))
    });
});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    if (data.type == 'message' && getUser(data.user).name != bot.name) {
        if (data.text.indexOf("you deploy a") >= 0) {
            reply(data, "Sure, I have your credentials for Amazon EC2, should I deploy it on AWS?")
        } else if (data.text.indexOf("Yes") >= 0) {
            reply(data, "I am working on it, please be patient...")
        } else if (data.text.indexOf("Ok") >= 0) {
            reply(data, "LAMP stack is deployed now on AWS EC2 instance, IP address for the instance is 192.168.0.1.")
        }
    }
    console.log(data)
});

function reply(data, msg) {
    console.log("replying to " + data.channel)
    console.log(data)
    var channel = getChannel(data.channel)
    if (channel) {
        console.log("replying in channel ")
        bot.postMessageToChannel(channel.name, msg, {
            as_user: true
        });
    } else {
        var user = getUser(data.user)
        bot.postMessageToUser(user.name, msg, {
            as_user: true
        });
    }
}

function getChannel(channelId) {
    return bot.channels.filter(function(item) {
        return item.id === channelId;
    })[0];
}

function getUser(userId) {
    return bot.users.filter(function(item) {
        return item.id === userId;
    })[0];
}
*/

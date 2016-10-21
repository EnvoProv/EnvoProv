//var SlackBot = require('slackbots');
var data = require("./mockdata.json");
var service = require("./mock_service.js");
var sys = require('sys')
var shell = require('child_process').exec;
var WitBot = require('../witaibot/index.js')
var witToken = process.env.WitToken

var botkit = require("botkit")
var credReady = false,
    clusterRequested = false;
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

var helpMessage = "Howdy!. No worries! I am here to help you!" +
    "\nMake sure you have following keywords:" +
    "\nSingle VM: 'single'" +
    "\nCluster VM: 'cluster' OR 'grid'" +
    "\nStacks available: 'LAMP' OR 'MEAN' OR 'LEMP'" +
    "\nExit current conversation: 'bye' OR 'Bye'";
var messageQueue = [];


botinstance.startRTM(function(err, bot, payload) {
    if (err) {
        console.error("ERR :" + err);
    }

    if (bot) {
        console.log('Bot initiated');
    }
})

botcontroller.hears(['help'], ['direct_message'], function(bot, message) {
    bot.reply(message, helpMessage);
});

var deployVm = function(bot, message) {
    var userName, newUsername, newPassword, techStack = null;

    var stacks = ['LAMP', 'MEAN'];
    var len = stacks.length;

    while (len--) {
        if (message.text.indexOf(stacks[len]) != -1)
            techStack = stacks[len];
    }

    bot.api.users.info({
        user: message.user
    }, (error, response) => {
        userName = response.user.name;
        bot.startConversation(message, function(err, convo) {

            if (techStack == null) {
                convo.ask('Sure! But I need some more information. Which technology stack do you want? LAMP , MEAN or LEMP', [{
                    pattern: '[a-z][A-Z][^bye]',
                    callback: function(response, convo) {
                        techStack = response.text;
                        convo.say('Thanks!');
                        convo.next();
                    }
                }, {
                    pattern: 'help',
                    callback: function(response, convo) {
                        bot.reply(message, helpMessage);
                        convo.stop();
                    }
                }, {
                    pattern: 'bye',
                    callback: function(response, convo) {
                        bot.reply(message, "Okay! Hope I helped");
                        convo.stop();
                    }
                }, {
                    default: true,
                    callback: function(response, convo) {
                        convo.say('I did not understand your response');
                        convo.repeat();
                        convo.next();
                    }
                }]);
            }

            if (service.areCredentialsPresent(userName, data.credentials)) {
                convo.ask('I have your Amazon EC2 credentials. Should I use them to deploy this VM?', [{
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        var vm = data.single_vm;
                        convo.say('Here it is!\n IP: ' + vm.IP + ' \nEnvironment: ' + vm.Environment);
                        convo.next();
                    }
                }, {
                    pattern: bot.utterances.no,
                    callback: function(response, convo) {
                        convo.say('Ok. Please provide new credentials');
                        convo.next();
                    }
                }, {
                    pattern: 'bye',
                    callback: function(response, convo) {
                        bot.reply(message, "Okay! Hope I helped");
                        convo.stop();
                    }
                }, {
                    pattern: 'help',
                    callback: function(response, convo) {
                        bot.reply(message, helpMessage);
                        convo.stop();
                    }
                }, {
                    default: true,
                    callback: function(response, convo) {
                        convo.say('I did not understand your response. Please say yes or no');
                        convo.repeat();
                        convo.next();
                    }
                }]);
            } else {

                convo.addQuestion('Provide Username', function(response, convo) {
                    newUsername = response.text;
                    convo.changeTopic('ask_password');
                }, {}, 'ask_username');

                convo.addQuestion('Provide password', function(response, convo) {
                    newPassword = response.text;
                    credReady = true;
                    if (service.checkNewCredentials(newUsername, newPassword, data.new_credentials)) {
                        bot.reply(message, 'Thanks!. I will now provision the VM for you');
                        var vm = data.single_vm;
                        bot.reply(message, 'Here it is!\n IP: ' + vm.IP + ' \nEnvironment: ' + vm.Environment);
                        convo.stop();
                    } else {
                        bot.reply(message, 'Wrong credentials. Try again!');
                        convo.changeTopic('ask_username');
                    }
                }, {}, 'ask_password');

                convo.ask('I dont have your credentials. Can you provide them? Say yes or no', [{
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.changeTopic('ask_username');
                        convo.next();
                    }
                }, {
                    pattern: bot.utterances.no,
                    callback: function(response, convo) {
                        bot.reply(message, "Oops! I will need you credentials to set up your VM(s). Ask me again when you have then. Bye!!");
                        convo.stop();
                    }
                }, {
                    pattern: 'bye',
                    callback: function(response, convo) {
                        bot.reply(message, "Okay! Hope I helped");
                        convo.stop();
                    }
                }, {
                    pattern: 'help',
                    callback: function(response, convo) {
                        bot.reply(message, helpMessage);
                        convo.stop();
                    }
                }, {
                    default: true,
                    callback: function(response, convo) {
                        convo.say('I didnt understand your response');
                        convo.repeat();
                        convo.next();
                    }
                }]);


            }

        });
    });
}

var createCluster = function(bot, message) {
    var userName, num_vms, newUsername, newPassword, techStack = null;
    console.log(message.match);
    var stacks = ['LAMP', 'MEAN'];
    var len = stacks.length;

    while (len--) {
        if (message.text.indexOf(stacks[len]) != -1)
            techStack = stacks[len];
    }
    console.log(techStack);
    bot.api.users.info({
        user: message.user
    }, (error, response) => {
        userName = response.user.name;

        bot.startConversation(message, function(err, convo) {
            if (techStack == null) {
                convo.ask('Sure! But I need some more information. Which technology stack do you want? LAMP , MEAN or LEMP', [{
                    pattern: '[a-z][A-Z][^bye]',
                    callback: function(response, convo) {
                        techStack = response.text;
                        convo.say('Thanks!');
                        convo.next();
                    }
                }, {
                    pattern: 'help',
                    callback: function(response, convo) {
                        bot.reply(message, helpMessage);
                        convo.stop();
                    }
                }, {
                    pattern: 'bye',
                    callback: function(response, convo) {
                        bot.reply(message, "Okay! Hope I helped");
                        convo.stop();
                    }
                }, {
                    default: true,
                    callback: function(response, convo) {
                        bot.reply(message, 'I did not understand your response');
                        convo.repeat();
                        convo.next();
                    }
                }]);
            }

            convo.ask("Sure! How many VM's do you want? ( 4, 8 or 16)", [{
                pattern: '[0-9]',
                callback: function(response, convo) {
                    num_vms = response.text;
                    if (!(parseInt(num_vms) == 4 || parseInt(num_vms) == 8 || parseInt(num_vms) == 16)) {
                        bot.reply(message, 'Sorry I need it to be 4, 8 or 16. Please enter a valid value');
                        convo.repeat();
                    } else {
                        convo.next();
                    }
                }
            }, {
                pattern: 'help',
                callback: function(response, convo) {
                    bot.reply(message, helpMessage);
                    convo.stop();
                }
            }, {
                pattern: 'bye',
                callback: function(response, convo) {
                    bot.reply(message, "Okay! Hope I helped");
                    convo.stop();
                }
            }, {
                default: true,
                callback: function(response, convo) {
                    bot.reply(message, 'I did not understand your response. Please tell me how many VM(s) you want');
                    convo.repeat();
                }
            }]);

            if (service.areCredentialsPresent(userName, data.credentials)) {
                convo.ask('Sure! I have your Amazon EC2 credentials. Should I use them to deploy this VM?', [{
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        if (!service.canProvision(userName, num_vms, data.credentials)) {
                            convo.say('Sorry you do not have enough resources to provision ' + num_vms + ' VMs');
                            convo.next();
                        } else {
                            var cluster = service.getUserInstances(userName, data.instances);
                            convo.say("Done! These are the details of your cluster\n");
                            convo.say("Here it is\n");
                            convo.say("Cluster ID :" + cluster.id);
                            for (inst in cluster.instances) {
                                var vm = cluster.instances[inst];
                                convo.say('\n IP: ' + vm.IP + ' \nEnvironment: ' + vm.Environment);
                            }
                            convo.next();

                        }


                    }
                }, {
                    pattern: bot.utterances.no,
                    callback: function(response, convo) {
                        convo.say('Ok. Please provide new credentials');
                        convo.next();
                    }
                }, {
                    pattern: 'help',
                    callback: function(response, convo) {
                        bot.reply(message, helpMessage);
                        convo.stop();
                    }
                }, {
                    default: true,
                    callback: function(response, convo) {
                        bot.reply(message, 'I did not understand your response.');
                        convo.repeat();
                    }
                }]);
            } else {

                convo.addQuestion('Provide Username', function(response, convo) {
                    newUsername = response.text;
                    convo.changeTopic('ask_password');
                }, {}, 'ask_username');

                convo.addQuestion('Provide password', function(response, convo) {
                    newPassword = response.text;
                    credReady = true;
                    if (service.checkNewCredentials(newUsername, newPassword, data.new_credentials)) {
                        if (!service.canProvision(newUsername, num_vms, data.new_credentials)) {
                            convo.say('Sorry you do not have enough resources to provision ' + num_vms + ' VMs');
                            convo.next();
                        } else {
                            var cluster = service.getUserInstances(userName, data.instances);
                            convo.say("Done! These are the details of your cluster\n");
                            convo.say("Cluster ID :" + cluster.id);
                            for (inst in cluster.instances) {
                                var vm = cluster.instances[inst];
                                convo.say('\n IP: ' + vm.IP + ' \nEnvironment: ' + vm.Environment);
                            }
                            convo.next();
                            //convo.stop();
                        }
                    } else {
                        bot.reply(message, 'Wrong credentials. Try again!');
                        convo.changeTopic('ask_username');
                    }
                }, {}, 'ask_password');

                convo.ask('I dont have your credentials. Can you provide them? Say yes or no', [{
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.changeTopic('ask_username');
                        convo.next();
                    }
                }, {
                    pattern: bot.utterances.no,
                    callback: function(response, convo) {
                        bot.reply(message, "Oops! I will need you credentials to set up your VM(s). Ask me again when you have then. Bye!!");
                        convo.stop();
                    }
                }, {
                    pattern: 'bye',
                    callback: function(response, convo) {
                        bot.reply(message, "Okay! Hope I helped");
                        convo.stop();
                    }
                }, {
                    pattern: 'help',
                    callback: function(response, convo) {
                        bot.reply(message, helpMessage);
                        convo.stop();
                    }
                }, {
                    default: true,
                    callback: function(response, convo) {
                        convo.say('I didnt understand your response');
                        convo.repeat();
                        convo.next();
                    }
                }]);


            }
        });
    });
}

var listResources = function(bot, message) {
    var userName;
    bot.api.users.info({
        user: message.user
    }, (error, response) => {
        userName = response.user.name;
        bot.startConversation(message, function(err, convo) {
            var instances = service.getUserInstances(userName, data.instances1);
            if (instances == undefined) {
                bot.reply(message, "You have not provisioned any instances");
            } else {
                var cluster = service.getUserInstances(userName, data.instances);
                convo.say("Here it is\n");
                convo.say("Cluster ID :" + cluster.id);
                for (inst in cluster.instances) {
                    var vm = cluster.instances[inst];
                    convo.say('\n IP: ' + vm.IP + ' \nEnvironment: ' + vm.Environment);
                }
                convo.next();
            }
        });

    });
}

var deleteResource = function(bot, message) {
    var userName, num_vms;
    bot.api.users.info({
        user: message.user
    }, (error, response) => {
        userName = response.user.name;

        bot.startConversation(message, function(err, convo) {

            convo.addQuestion('Are you sure you want to delete?', [{
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    bot.reply(message, "Done! The cluster has been deleted\n");
                    convo.stop();
                }
            }, {
                pattern: bot.utterances.no,
                callback: function(response, convo) {
                    bot.reply(message, 'Ok. Have great day');
                    convo.stop();
                }
            }, {
                pattern: 'help',
                callback: function(response, convo) {
                    bot.reply(message, helpMessage);
                    convo.stop();
                }
            }, {
                default: true,
                callback: function(response, convo) {
                    bot.reply(message, 'I did not understand your response. Try again');
                    convo.stop();
                }
            }], {}, 'ask_confirmation');


            convo.ask("Could you provide the ID of the VM to be deleted?", function(response, convo) {
                id_vms = response.text;
                convo.next();
            });

            if (service.areCredentialsPresent(userName, data.credentials)) {
                convo.ask('Sure! I have your Amazon EC2 credentials.Should I use them to delete this VM?', [{
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        if (!service.checkInstances(userName, data.instances1, id_vms)) {
                            convo.say('Sorry the VM ID selected does not exists or you do not have access rights to it');
                            convo.next();
                        } else {
                            convo.changeTopic('ask_confirmation');
                            //convo.say("Done! The cluster has been deleted\n");
                            convo.next();
                        }


                    }
                }, {
                    pattern: bot.utterances.no,
                    callback: function(response, convo) {
                        convo.say('Ok. Please provide new credentials');
                        convo.next();
                    }
                }, {
                    pattern: 'help',
                    callback: function(response, convo) {
                        bot.reply(message, helpMessage);
                        convo.stop();
                    }
                }, {
                    default: true,
                    callback: function(response, convo) {
                        convo.say('I did not understand your response');
                        convo.next();
                    }
                }]);
            } else {


                convo.addQuestion('Provide Username', function(response, convo) {
                    newUsername = response.text;
                    convo.changeTopic('ask_password');
                }, {}, 'ask_username');

                convo.addQuestion('Provide password', function(response, convo) {
                    newPassword = response.text;
                    credReady = true;
                    //console.log(id_vms+ "::");
                    if (service.checkNewCredentials(newUsername, newPassword, data.new_credentials)) {
                        if (service.checkInstances(newUsername, data.instances1, id_vms)) {
                            convo.changeTopic('ask_confirmation');
                        } else {
                            bot.reply(message, 'Sorry the VM ID selected does not exists or you do not have access rights to it');
                        }

                    } else {
                        bot.reply(message, 'Wrong credentials. Try again!');
                        convo.changeTopic('ask_username');
                    }
                }, {}, 'ask_password');


                convo.ask('I dont have your credentials. Can you provide them?', [{
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.changeTopic('ask_username');
                        convo.next();
                    }
                }, {
                    default: true,
                    callback: function(response, convo) {
                        convo.say('I didnt understand your response');
                        convo.repeat();
                        convo.next();
                    }
                }]);


            }
        });
    });
}

var witbot = WitBot(witToken);

botcontroller.hears('.*', ['direct_message', 'direct_mention'], function(bot, message) {
    var wit = witbot.process(message.text, bot, message);

    wit.hears('greeting', 0.5, function(bot, message, outcome) {
        bot.api.users.info({
            user: message.user
        }, (error, response) => {
            var name = response.user.name;
            bot.reply(message, "Hi @" + name + " .How can I help you?");
        });
    })

    wit.hears('cheerful question', 0.5, function(bot, message, outcome) {
        bot.reply(message, "I am good, how're you?")
    })

    wit.hears('create VM', 0.5, deployVm);
    wit.hears('create cluster', 0.5, createCluster);
    wit.hears('list resources', 0.5, listResources);
    wit.hears('delete resource', 0.5, deleteResource);
    wit.otherwise(function(bot, message) {
        bot.reply(message, 'You are so intelligent, and I am so simple. I don\'t understnd')
    })
});

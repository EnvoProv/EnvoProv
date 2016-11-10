var data = require("./mockdata.json");
var service = require("./service.js");
var shell = require('child_process').exec;
var WitBot = require('../witaibot/index.js')
var Slack_file_upload = require('node-slack-upload');
var fs = require('fs');
const path = require('path');
var slack_file_upload = new Slack_file_upload(process.env.EnvoProvToken);
var Slack = require('slack-node');
var slack = new Slack(process.env.EnvoProvToken);
var Sync = require('sync')
var request = require('request');
var includes = require('array-includes');
var witToken = process.env.WitToken
var AWS = require('aws-sdk');

var botkit = require("botkit")
var credReady = false,
    clusterRequested = false;
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
var userInfo = {
    techStack: null,
    userName: null,
    cluster: false
}

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

function askForTechnologyStack(userInfo, convo, bot, message) {
    if(!userInfo.cluster) {
        convo.ask('Which technology stack do you want installed on the VM? Apache, LAMP , MEAN or LEMP', [{
        pattern: '[a-z][A-Z][^bye]',
        callback: function(response, convo) {
            userInfo.techStack = response.text;
            var proper_response = includes(["LAMP", "MEAN", "LEMP", "Apache"], response.text)
            if (!proper_response) {
                convo.say('Please choose between Apache, LAMP, MEAN and LEMP');
                convo.repeat();
                convo.next();
            } else {
                convo.next();
                handleCredentials(userInfo, convo, bot, message);
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
            convo.say('I did not understand your response');
            convo.repeat();
            convo.next();
        }
    }]);
    } else {
    	convo.ask('Which technology stack do you want installed on the Cluster? Apache, LAMP , MEAN or LEMP', [{
        pattern: '[a-z][A-Z][^bye]',
        callback: function(response, convo) {
            userInfo.techStack = response.text;
            var proper_response = includes(["LAMP", "MEAN", "LEMP", "Apache"], response.text)
            if (!proper_response) {
                convo.say('Please choose between Apache, LAMP, MEAN and LEMP');
                convo.repeat();
                convo.next();
            } else {
                convo.next();
                handleCredentials(userInfo, convo, bot, message);
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
            convo.say('I did not understand your response');
            convo.repeat();
            convo.next();
        }
    }]);
    }
}

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

// function deployVirtualMachine(username, convo, bot, message) {
//     console.log(username)
//     service.getUserConfiguration(username, function(configuration) {
//         service.getPrivateKeyInformation(username, function(private_key_info) {
          
//               AWS.config.update({
//                   accessKeyId: configuration['AWSAccessKeyId'], secretAccessKey: configuration["AWSSecretKey"], region: configuration["region"]
//               });
//               var ec2 = new AWS.EC2(); 
      
//               var params = {
//                  ImageId: 'ami-2d39803a', // Ubuntu 14.04 amd64
//                  InstanceType: 't2.micro',
//                  MinCount: 1,
//                  MaxCount: 1,
//                  KeyName: private_key_info.filename
//               };

//               convo.say("Creating a VM for you on EC2, sit back and relax! I will let you know the details once it is up and running!");
//               convo.stop();
//               ec2.runInstances(params, function(err, data) {
//               if (err) {
//                   console.log("Could not create instance", err);
//                   return;
//               }

//               var instanceId = data.Instances[0].InstanceId;
//               instance_ID = data.Instances[0].InstanceId;
//               console.log("Created instance", instanceId);
//               var params = {
//                   DryRun: false,
//                   InstanceIds: [
//                       instance_ID
//                       /* more items */
//                   ]
//               };
//               ec2.waitFor('instanceRunning', params, function(err, data) {
//                 if (err) console.log(err, err.stack); // an error occurred
//                 else  {
//                      console.log(data.Reservations[0].Instances[0]);
//                      var newInstance = data.Reservations[0].Instances[0];
//                      service.storeInstanceForUser(username, newInstance, function(instance){
//                            bot.reply(message, "Your instance is ready");
//                            bot.reply(message, "\n\nInstance Id : " + instance.instanceid + "\nPublic DNS Name: " + instance.publicdns + "\nPublic IP: " + instance.publicip);
//                      })
//                   }        
//               });
              

//               }
//               );

              
             
//             // var awsInstanceCommand = parse("knife ec2 server create -I %s -f %s --ssh-user %s --aws-access-key-id %s --aws-secret-access-key %s --region %s --identity-file ~/.ssh/SETest.pem --ssh-key %s -r 'recipe[apt], recipe[apache]'",
//             //     configuration["image-id"], configuration["instance-type"], configuration["ssh-user"],
//             //     configuration["AWSAccessKeyId"], configuration["AWSSecretKey"], configuration["region"], private_key_info.file_name)
//             // convo.say("Creating a VM for you on EC2, sit back and relax! I will let you know the details once it is up and running!")
//             // shell(awsInstanceCommand, function puts(error, stdout, stderr) {
//             //     console.log(error)
//             //     console.log(stdout)
//             //     console.log(stderr)
//             //     bot.reply(message, stdout)
//             // });
//         })
//     });
// }

function deployVirtualMachine(userInfo, username, convo, bot, message) {
    console.log(username)
    service.getUserConfiguration(username, function(configuration) {
        service.getPrivateKeyInformation(username, function(private_key_info) {
                var awsInstanceCommand1 = parse("knife ec2 server create -I %s -f %s --ssh-user %s --aws-access-key-id %s --aws-secret-access-key %s --region %s --identity-file ~/.ssh/SETest.pem --ssh-key %s -r 'recipe[apt], recipe[apache]'",
                configuration["image-id"], configuration["instance-type"], configuration["ssh-user"],
                configuration["AWSAccessKeyId"], configuration["AWSSecretKey"], configuration["region"], private_key_info.file_name) 
                
                var awsInstanceCommand2 = parse("knife ec2 server create -I %s -f %s --ssh-user %s --aws-access-key-id %s --aws-secret-access-key %s --region %s --identity-file ~/.ssh/SETest.pem --ssh-key %s -r 'recipe[apt], recipe[mysql]'",
                configuration["image-id"], configuration["instance-type"], configuration["ssh-user"],
                configuration["AWSAccessKeyId"], configuration["AWSSecretKey"], configuration["region"], private_key_info.file_name) 

                var awsInstanceCommand3 = parse("knife ec2 server create -I %s -f %s --ssh-user %s --aws-access-key-id %s --aws-secret-access-key %s --region %s --identity-file ~/.ssh/SETest.pem --ssh-key %s -r 'recipe[apt], recipe[php]'",
                configuration["image-id"], configuration["instance-type"], configuration["ssh-user"],
                configuration["AWSAccessKeyId"], configuration["AWSSecretKey"], configuration["region"], private_key_info.file_name) 

                var awsInstanceCommand = parse("knife ec2 server create -I %s -f %s --ssh-user %s --aws-access-key-id %s --aws-secret-access-key %s --region %s --identity-file ~/.ssh/SETest.pem --ssh-key %s -r 'recipe[apt], recipe[apache], recipe[mysql], recipe[php]'",
                configuration["image-id"], configuration["instance-type"], configuration["ssh-user"],
                configuration["AWSAccessKeyId"], configuration["AWSSecretKey"], configuration["region"], private_key_info.file_name)
                
            convo.say("Creating a VM for you on EC2, sit back and relax! I will let you know the details once it is up and running!")
            if(userInfo.quantity) {
                shell(awsInstanceCommand1, function puts(error, stdout, stderr) {
                console.log(error)
                console.log(stdout)
                console.log(stderr)
                bot.reply(message, stdout)
                });

                shell(awsInstanceCommand2, function puts(error, stdout, stderr) {
                console.log(error)
                console.log(stdout)
                console.log(stderr)
                bot.reply(message, stdout)
                });

                shell(awsInstanceCommand3, function puts(error, stdout, stderr) {
                console.log(error)
                console.log(stdout)
                console.log(stderr)
                bot.reply(message, stdout)
                });
            } else {
                shell(awsInstanceCommand, function puts(error, stdout, stderr) {
                console.log(error)
                console.log(stdout)
                console.log(stderr)
                bot.reply(message, stdout)
                });
            }
            
        })
    });
}

function checkPrivateKeyFile(username, convo, bot, message) {
    service.isAWSPrivateKeyPresent(username, function(isPresent, username) {
        if (isPresent) {
            deployVirtualMachine(userInfousername, convo, bot, message);
        } else {
            convo.say("Please upload your private key file");
            botcontroller.on('file_shared', function(bot, content) {
                slack.api("files.info", {
                    file: content.file.id
                }, function(err, response) {
                    bot.startConversation(message, function(err, convo) {
                        if (err) {
                            convo.say("Error occured: " + err);
                        } else {
                            slack.api("files.delete", {
                                file: content.file.id
                            })
                            var ext = response.file.name.substring(response.file.name.lastIndexOf(".") + 1)
                            if (ext === "pem") {
                                service.storeAWSPrivateKeyInformation(userInfo.userName, response.file.name, response.content,
                                    function() {
                                        deployVirtualMachine(userInfo, username, convo, bot, message);
                                    })
                            }
                        }
                    });
                });
            });
        }
    });
}

function handleCredentials(userInfo, convo, bot, message) {
    console.log("Inside handle credentials")
    service.areCredentialsPresent(userInfo.userName, function(isPresent, username) {
        if (isPresent) {
            console.log("I have credentials")
            convo.say("I have your AWS credentials")
            checkPrivateKeyFile(userInfo, username, convo, bot, message);
        } else {
            console.log("Uploading credentials file")
            slack_file_upload.uploadFile({
                file: fs.createReadStream(path.join(__dirname, '../configurations_formats', 'aws_credentials.json')),
                filetype: '.json',
                title: 'AWS credentials format',
                initialComment: 'AWS credentials format'
            }, function(err, data) {
                // console.log("In uploadaed callback");
                // console.log(convo);
                if (err) convo.say("Error occured " + err)
                convo.say("I don't have your AWS credentials, please download this json file,\
        fill it up and send back to me! " + data.file.url_private_download);

                botcontroller.on('file_shared', function(bot, content) {
                    slack.api("files.info", {
                        file: content.file.id
                    }, function(err, response) {
                        bot.startConversation(message, function(err, convo) {
                            if (err) {
                                convo.say("Error occured: " + err);
                            } else {
                                if (response.file.name === "aws_credentials.json") {
                                    userInfo.techStack = null;
                                    //console.log(response.content)
                                    service.storeAWSCredentialInformation(userInfo.userName, JSON.parse(response.content), function() {
                                        handleCredentials(userInfo, convo, bot, message);
                                    })
                                }
                            }
                        });
                    });
                });
            });

        }
    });
}

function askForConfiguration(userInfo, convo, bot, message) {
    slack_file_upload.uploadFile({
        file: fs.createReadStream(path.join(__dirname, '../configurations_formats', 'aws.json')),
        filetype: '.json',
        title: 'AWS config format',
        initialComment: 'AWS config format'
    }, function(err, data) {
        if (err) {
            console.error(err);
        } else {
            convo.say("Your AWS configuration is missing, please download this json file,\
          fill it up and send back to me! " + data.file.url_private_download);

            botcontroller.on('file_shared', function(bot, content) {
                console.log(content);
                slack.api("files.info", {
                    file: content.file.id
                }, function(err, response) {
                    bot.startConversation(message, function(err, convo) {
                        if (err) {
                            convo.say("Error occured: " + err);
                        } else {
                              console.log(response);
                            if (response.file.name === "aws.json") {
                                userInfo.techStack = null;
                                //console.log(response.content)
                                service.storeAWSConfigurationInformation(userInfo.userName, JSON.parse(response.content), function() {
                                    askForTechnologyStack(userInfo, convo, bot, message);
                                    //handleCredentials(userInfo, convo, bot);
                                })
                            }
                        }
                    });
                });
            });
        }
    });
}



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
        userInfo.userName = response.user.name;
        bot.startConversation(message, function(err, convo) {
            service.isConfigurationInformationAvailable(userInfo.userName,
                function(isAvailable) {
                    if (isAvailable) {
                        convo.say("I have your AWS Configuration");
                        askForTechnologyStack(userInfo, convo, bot, message);
                    } else {
                        askForConfiguration(userInfo, convo, bot, message);
                    }
                });
        });
    });
}

var createCluster = function(bot, message) {
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
        userInfo.userName = response.user.name;
        userInfo.cluster = true;
        bot.startConversation(message, function(err, convo) {
            service.isConfigurationInformationAvailable(userInfo.userName,
                function(isAvailable) {
                    if (isAvailable) {
                        convo.say("I have your AWS Configuration");
                        askForTechnologyStack(userInfo, convo, bot, message);
                    } else {
                        askForConfiguration(userInfo, convo, bot, message);
                    }
                });
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
            //var instances = service.getUserInstances(userName, data.instances1);
            service.getUserInstances(userName, function(instances){
               if (instances.length == 0) {
                   bot.reply(message, "You have not provisioned any instances");
               } else {
                   // var cluster = service.getUserInstances(userName, data.instances);
                   // convo.say("Here it is\n");
                   // convo.say("Cluster ID :" + cluster.id);
                   // for (inst in cluster.instances) {
                   //     var vm = cluster.instances[inst];
                   //     convo.say('\n IP: ' + vm.IP + ' \nEnvironment: ' + vm.Environment);
                   // }
                   // convo.next();
                   convo.say("Here is the list of your instances: \n");
                   instances.forEach(function(instance, index){
                       convo.say("Instance ID: " + instance.instanceid); 
                   });
               }

            });
        });

    });
}

var testDelete = function(userid, configuration, id){
   console.log("In delete test");
  
   AWS.config.update({region:'us-east-1'});
 
   var ec2 = new AWS.EC2(
      {
         accessKeyId: configuration['AWSAccessKeyId'], 
         secretAccessKey: configuration["AWSSecretKey"], 
      }
   );

   var params = {
      InstanceIds: [ 
         id
      ],
      // DryRun: true || false
   };
   ec2.terminateInstances(params, function(err, data) {
     if(err) 
         console.log(err, err.stack); // an error occurred
     else{     
         console.log("Success\n" + data);           // successful response
         service.deleteInstance(userid, id);
      }
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
                    testDelete(id_vms);
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

            service.areCredentialsPresent(userName, function(isPresent){
               if (isPresent) {
                   convo.ask('Sure! I have your Amazon EC2 credentials.Should I use them to delete this VM?', [{
                       pattern: bot.utterances.yes,
                       callback: function(response, convo) {
                           service.checkInstances(userName, id_vms, function(okay){
                              if(!okay) {
                                  convo.say('Sorry the VM ID selected does not exists or you do not have access rights to it');
                                  convo.next();
                              } else {
                                  service.getUserConfiguration(userName, function(configuration){
                                       testDelete(userName, configuration, id_vms);  
                                  });
                                  //convo.changeTopic('ask_confirmation');
                                  convo.next();
                              }
                           
                           });
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
    });
}
var witbot = WitBot(witToken);

botcontroller.hears('.*', ['direct_message', 'direct_mention'], function(bot, message) {
    //console.log(message);
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
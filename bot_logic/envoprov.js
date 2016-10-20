//var SlackBot = require('slackbots');
var data = require("./mockdata.json");
var service = require("./mock_service.js");
var sys = require('sys')
var shell = require('child_process').exec;
var WitBot = require('../witaibot/index.js')
var witToken = process.env.WitToken

var botkit = require("botkit")
var credReady = false,clusterRequested=false;
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
		bot.say({text:"Hi! I am EnvoProv. I can provision VMs for you on different cloud providers. I also support a number of stacks like LAMP and MEAN. "+
						"\nJust tell me what to do!. At any time if you need help, just say 'Help' and I'll be there. Lets get started"});
    }
})

// botcontroller.hears(['poll'], ['direct_message'], function(bot, message) {
//   while (messageQueue.length > 0)
//   {
//     bot.reply(message, messageQueue.shift());
//   }
// });
//
// botcontroller.hears(['apache server'], ['direct_message'], function(bot, message) {
//     var awsInstanceCommand = "knife ec2 server create -I ami-2d39803a -f t2.micro --ssh-user ubuntu --region us-east-1 --identity-file ~/.ssh/chef-keypair.pem -r 'recipe[apt], recipe[apache]'"
//     shell(awsInstanceCommand, function puts(error, stdout, stderr) { console.log(stderr); messageQueue.push(stdout) });
//     bot.reply(message, 'Deploying an apache server for you on AWS, I will get back to you when your instance is ready ...');
// });

var deployVm =  function(bot, message) {
    var userName, newUsername, newPassword;
	bot.api.users.info({user: message.user}, (error, response) => {
		userName = response.user.name;
		bot.startConversation(message, function(err, convo){

				if(service.areCredentialsPresent(userName,data.credentials)){
					convo.ask('Sure! I have your Amazon EC2 credentials. Should I use them to deply this VM?',[
						{
							pattern: bot.utterances.yes,
							callback: function(response,convo){
								var vm = data.single_vm;
								convo.say('Here it is!\n IP: '+vm.IP+' \nEnvironment: ' + vm.Environment);
								convo.next();
							}
						},
						{
							pattern: bot.utterances.no,
							callback: function(response,convo){
								convo.say('Ok. Please provide new credentials');
								convo.next();
							}
						},
						{
							default: true,
							callback: function(response,convo){
								convo.say('I did not understand your response');
								convo.next();
							}
						}
					]);
				}else{

					convo.addQuestion('Provide Username',function(response, convo){
						newUsername = response.text;
						convo.changeTopic('ask_password');
					},{},'ask_username');

					convo.addQuestion('Provide password',function(response, convo){
						newPassword = response.text;
						credReady = true;
						if(service.checkNewCredentials(newUsername, newPassword, data.new_credentials)){
							bot.reply(message,'Thanks!. I will now provision the VM for you');
							var vm = data.single_vm;
							bot.reply(message, 'Here it is!\n IP: '+vm.IP+' \nEnvironment: ' + vm.Environment);
							convo.stop();
						}else{
							bot.reply(message, 'Wrong credentials. Try again!');
							convo.changeTopic('ask_username');
						}
					},{},'ask_password');

					convo.ask('I dont have your credentials. Can you provide them?',[
						{
							pattern: bot.utterances.yes,
							callback: function(response,convo){
								convo.changeTopic('ask_username');
								convo.next();
							}
						},
						{
							pattern: 'bye',
							callback: function(response,convo){
								console.log("In here");
								bot.reply(message,"Okay! Hope I helped");
								convo.stop();
							}
						},
						{
							default:true,
							callback: function(response, convo){
								convo.say('I didnt understand your response');
								convo.repeat();
								convo.next();
							}
						}
					]);


				}

		});
	});
}

botcontroller.hears(['create(.*)cluster'],['direct_message'], function(bot, message) {
    var userName, num_vms;
	bot.api.users.info({user: message.user}, (error, response) => {
		userName = response.user.name;

		bot.startConversation(message, function(err, convo){

			convo.ask("Sure! How many VM's do you want? ( 4, 8 or 16)",function(response,convo){
				num_vms	= response.text;
				convo.next();
			});

				if(service.areCredentialsPresent(userName,data.credentials)){
					convo.ask('Sure! I have your Amazon EC2 credentials. Should I use them to deply this VM?',[
						{
							pattern: bot.utterances.yes,
							callback: function(response,convo){
								if(!service.canProvision(userName, num_vms, data.credentials)){
									convo.say('Sorry you do not have enough resources to provision ' + num_vms +' VMs');
									convo.next();
								}else{
									var instances = service.getUserInstances(userName, data.instances);
									convo.say("Done! These are the details of your cluster\n");
									for(inst in instances){
										var vm = instances[inst];
										convo.say('Here it is!\n IP: '+vm.IP+' \nEnvironment: ' + vm.Environment);
									}
									convo.next();

								}


							}
						},
						{
							pattern: bot.utterances.no,
							callback: function(response,convo){
								convo.say('Ok. Please provide new credentials');
								convo.next();
							}
						},
						{
							default: true,
							callback: function(response,convo){
								convo.say('I did not understand your response');
								convo.next();
							}
						}
					]);
				}else{

					convo.addQuestion('Provide Username',function(response, convo){
						newUsername = response.text;
						convo.changeTopic('ask_password');
					},{},'ask_username');

					convo.addQuestion('Provide password',function(response, convo){
						newPassword = response.text;
						credReady = true;
						if(service.checkNewCredentials(newUsername, newPassword, data.new_credentials)){
							bot.reply(message,'Thanks!. I will now provision the VM for you');
							var instances = service.getUserInstances(newUsername, data.instances);
							bot.reply(message, "Done! These are the details of your cluster\n");
							for(inst in instances){
								var vm = instances[inst];
								bot.reply(message, '\n IP: '+vm.IP+' \nEnvironment: ' + vm.Environment);
							}
							convo.stop();
						}else{
							bot.reply(message, 'Wrong credentials. Try again!');
							convo.changeTopic('ask_username');
						}
					},{},'ask_password');

					convo.ask('I dont have your credentials. Can you provide them?',[
						{
							pattern: bot.utterances.yes,
							callback: function(response,convo){
								convo.changeTopic('ask_username');
								convo.next();
							}
						},
						{
							pattern: 'bye',
							callback: function(response,convo){
								bot.reply(message, "Okay! Hope I helped");
								convo.stop();
							}
						},
						{
							default:true,
							callback: function(response, convo){
								convo.say('I didnt understand your response');
								convo.repeat();
								convo.next();
							}
						}
					]);


				}
		});
	});
});

botcontroller.hears(['list','all provision'],['mention', 'direct_message'], function(bot, message) {
    var userName;
	bot.api.users.info({user: message.user}, (error, response) => {
		userName = response.user.name;
		bot.startConversation(message, function(err, convo){
			var instances = service.getUserInstances(userName, data.instances);
			if(instances == undefined)
			{
				bot.reply(message, "You have not provisioned any instances");
			}
			else
			{
				for(inst in instances){
					var vm = instances[inst];
					bot.reply(message, '\n Instance ID: '+vm.ID+' \nIP: '+vm.IP+' \nEnvironment: ' + vm.Environment+' \nStack: '+vm.Stack);
				}
			}
		});

	});
});

botcontroller.hears(['delete(.*)cluster','delete(.*)instance'],['direct_message'], function(bot, message) {
    var userName, num_vms;
	bot.api.users.info({user: message.user}, (error, response) => {
		userName = response.user.name;

		bot.startConversation(message, function(err, convo){

			convo.addQuestion('Are you sure you want to delete?',[
						{
							pattern: bot.utterances.yes,
							callback: function(response,convo){
									bot.reply(message,"Done! The cluster has been deleted\n");
									convo.stop();
							}
						},
						{
							pattern: bot.utterances.no,
							callback: function(response,convo){
								bot.reply(message,'Ok. Have great day');
								convo.stop();
							}
						},
						{
							default: true,
							callback: function(response,convo){
								bot.reply(message,'I did not understand your response. Try again');
								convo.stop();
							}
						}
					],{},'ask_confirmation');


			convo.ask("Could you provide the ID of the VM to be deleted?",function(response,convo){
				id_vms	= response.text;
				convo.next();
			});

				if(service.areCredentialsPresent(userName,data.credentials)){
					convo.ask('Sure! I have your Amazon EC2 credentials.Should I use them to delete this VM?',[
						{
							pattern: bot.utterances.yes,
							callback: function(response,convo){
								if(!service.checkInstances(userName, data.instances, id_vms)){
									convo.say('Sorry the VM ID selected does not exists or you do not have access rights to it');
									convo.next();
								}else{
									convo.changeTopic('ask_confirmation');
									//convo.say("Done! The cluster has been deleted\n");
									convo.next();
								}


							}
						},
						{
							pattern: bot.utterances.no,
							callback: function(response,convo){
								convo.say('Ok. Please provide new credentials');
								convo.next();
							}
						},
						{
							default: true,
							callback: function(response,convo){
								convo.say('I did not understand your response');
								convo.next();
							}
						}
					]);
				}else{


					convo.addQuestion('Provide Username',function(response, convo){
						newUsername = response.text;
						convo.changeTopic('ask_password');
					},{},'ask_username');

					convo.addQuestion('Provide password',function(response, convo){
						newPassword = response.text;
						credReady = true;
						//console.log(id_vms+ "::");
						if(service.checkNewCredentials(newUsername, newPassword, data.new_credentials)){
							if(service.checkInstances(newUsername, data.instances, id_vms)) {
								convo.changeTopic('ask_confirmation');
							} else {
								bot.reply(message, 'Sorry the VM ID selected does not exists or you do not have access rights to it');
							}

						}else{
							bot.reply(message, 'Wrong credentials. Try again!');
							convo.changeTopic('ask_username');
						}
					},{},'ask_password');


					convo.ask('I dont have your credentials. Can you provide them?',[
						{
							pattern: bot.utterances.yes,
							callback: function(response,convo){
								convo.changeTopic('ask_username');
								convo.next();
							}
						},
						{
							default:true,
							callback: function(response, convo){
								convo.say('I didnt understand your response');
								convo.repeat();
								convo.next();
							}
						}
					]);


				}
		});
	});
});

var witbot = WitBot(witToken);

botcontroller.hears('.*', ['direct_message', 'direct_mention'], function(bot, message) {
    var wit = witbot.process(message.text, bot, message);

    wit.hears('greeting', 0.5, function(bot, message, outcome) {
        bot.api.users.info({user: message.user}, (error, response) => {
  		      var name = response.user.name;
  		      bot.reply(message, "Hi @" +name+" .How can I help you?" );
  	    });
    })

    wit.hears('cheerful question', 0.5, function(bot, message, outcome) {
        bot.reply(message, "I am good, how're you?")
    })

    wit.hears('create VM', 0.5, deployVm);

    wit.otherwise(function(bot, message) {
        bot.reply(message, 'You are so intelligent, and I am so simple. I don\'t understnd')
    })
});

[![Build Status](https://travis-ci.org/EnvoProv/EnvoProv.svg?branch=master)](https://travis-ci.org/EnvoProv/EnvoProv)

#EnvoProv

Envoprov is an interactive bot which helps user provision stacks (LAMP, MEAN etc) on user's cloud provider by interaction via Slack.

###Team
* Aniket Patel: apatel10
* Gaurav Aradhye: garadhy
* Subodh Dharmadhikari: ssdharma
* Kartikeya Pharasi: kpharas
* Shruti Kuber: skuber

###Steps to run configuration management and deployment scripts.
* Create an instance in AWS using a registered private key.
* Install ansible on your host machine.
* Add the IP of the AWS instance created and add it to inventory file.
* Edit the file setTokens.sh by adding SLACK_TOKEN and WitToken.
* Run `ansible-playbook EnvoProvDeploy.yaml -i inventory`.
* After successful configuration you would see the 'envoprov' bot activated.
* The description of the three use cases and steps to run them are provided in the Acceptance Testing Document [Click here!](https://github.com/EnvoProv/EnvoProv/blob/Service/ACCEPTANCE-TESTING.md)

Note: We have sent accross an invitation to join the slack group - `csc510-project-group`

###Screencast displaying configuration management and functioning use case:

###Design Document [Click here!](https://github.com/EnvoProv/EnvoProv/blob/master/DESIGN.md)
###Bot Document [Click here!](https://github.com/EnvoProv/EnvoProv/blob/master/BOT.md)
###Service Document [Click here!](https://github.com/EnvoProv/EnvoProv/blob/Service/SERVICE.md)
###Acceptance Testing Document [Click here!](https://github.com/EnvoProv/EnvoProv/blob/Service/ACCEPTANCE-TESTING.md)





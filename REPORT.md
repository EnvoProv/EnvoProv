# Envoprov - Environment Provisioning Assistant bot

## Team

* Aniket Patel (apatel10)
* Gaurav Aradhye (garadhy)
* Kartikeya Pharasi (kpharas)
* Shruti Kuber (skuber)
* Subodh Dharmadhikari (ssdharma)


## Problem

Often creation of environments for different type of deployments such as production, testing, development, staging is a painstakingly long and manual process. In addition to this, if the deployment consists of a particular technology stack having multiple interconnected components, the configuration of such components has to be done by a knowledgeable person.

Also, configuration of the different components of technology stack is a manual process and due to the high probability of various dependencies being present, manual configuration can induce several errors, thus delaying the deployment. By automating this process, the entire process will be error free and faster.

## Solution

EnvoProv is a conversational bot which will assist the user to provision the machines on Amazon Web Services.

It assists the user by creating and provisioning required machines with the desired technology stack like LAMP and MEAN by obtaining the necessary details like configurations and necessary credentials from the user. The output that the bot provides to the user contain all the details of the provisioned machine that the user will need to access it and begin using it.

Since we are using AWS, it provides information something like the follwoing:

<pre>
Instance Id : i-9a9a9a99a9a
Public DNS Name: ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com
Public IP: xxx.xxx.xxx.xxx
</pre>

This information will be helpful in accessing the machines for future use.

The bot thus, makes life easier for user to automate the process to create and install the software required and in less amount of time than the manual process.

The target audience we intend to cover with this bot can be a student who wants to go through less steps in creation, installation of softwares and mainitainance of any VM for academic purpose. It can also be used by a System Administrator, where he can request a sinlge VM on demand for his work or provision a cluster of VM based on demands of project for testing or new developemnt environment.

## Screenshots

The following screenshots demonstrates some basic conversation with _@envoprov_

* User can type in **help** to get basic commands the @envoprov can understand.

  ![help](./docs/help.PNG)


* A sample conversation to create a **single VM** on cloud can be seen below:

  ![single](./docs/singleworkflow.PNG)


* A sample conversation to create a **cluster** of 3 VM (default number of machines in a cluster) can be seen below:

  ![cluster](./docs/clusterworkflow.PNG)

 * A sample conversation to **delete** a instance either a created as a single VM or as a part of cluster can be seen below:

 <br>![delete](./docs/deleteworkflow.PNG)



## Primary Features

* Automated Cloud VM provisioning.
* Installation of requested software/ technology stack
* Ready-to-Deploy scripts for installation of bot.
* Integrate the bot with help of slackapp with any team.
* Easy to enter credentials of VM provider, use file upload feature to perform this action. User need not enter the credentials.
* Guide the user through the entire process with detailed instructions

## Reflection on Development process and project

#### Development and Deployment environment

 * _Slack_  - Bot hosting agent.
 * _EC2 Amazon Web Services_ - Bot hosting server.
 * _NodeJS_ - Development platform.
 * _mongoDB_ - Database for storage of user information.
 * _wit.ai_ - Natural Language Processing API for slack input processing.
 * _Chef_ - Internal Configuration Management tool to perform provisioning of technology stacks.
 * _Ansible_ - Configuration Management and Deployment tool to deploy the bot on any platform.

####Architectural components:

**wit.ai** - This is an external AI service which we used for two purposes. First, for understanding the user input better and allow user to use normal english language as opposed to using fixed set commands. And second, to process user input and get structured data back so as to understand the input accurately and take further actions accordingly.

We gave multiple possible user inputs ourselves to the AI and trained the AI service to categorize the input into a specific category of intent. We set 0.5 as a threshold for intent matching. After training with sample data, we tested the AI service by requesting third party members outside the project to interact with the bot. We then monitored the AI to check if it correctly categorizes the input into matching intent category (match should be greater than 0.5). In some cases, when it could not categorize it correctly, we trained the bot again to deal with those particular cases so that the next time it works correctly.

For unmatched inputs, the AI service responded with helpful message such as "I don't understand your input". We disregarded garbage inputs effectively.

All this process helped to have interaction with the bot in natural language.

**Chef** - Chef is the key component of our backend where the actual infrastructure creation takes place. We used the free version of enterprize Chef server (free upto 5 organizations). Once the Chef server was configured, we uploaded all the necessary cookbooks that contained the packages that our bot supported. After all the cookbooks were available, we used the server on which the bot was deployed as the Chef workstation. The benefit of using it as Chef workstation was all that bot had to do was convert the input received from wit.ai into appropriate Chef commands. For this to happen, it's necessary that you have Chef Development Kit installed on the same machine.

After Chef commands were fired from the Bot server, first the `knife-ec2` plugin for Chef would allocate the VMs on AWS and install Chef Client on the nodes and then the Chef clients on the nodes would independently download all the required cookbooks from Chef Server, run them on the nodes and return back after the completion of tasks.

**MongoDB** - We used MongoDB to store the user data on Bot server. The decision to use MongoDB as opposed to traditional SQL databases was based on the fact that the data received from the Cloud Providers was in JSON format with multitudes of different keys. It would have been very difficult to use SQL databases tracking huge number of columns in this case. And the advantage MongoDB provided was it allowed it to store unstructured JSON data in effective manner without any issue.


#### An overview of your whole development process:<br>
<p> We began from the basics learnt in the class workshops which involved us to develop a bot using Slack. Our project used a wide variety of technology stack ranging from Nodejs, Slack, AWS, Ansible, Chef and Witai. Beginning from the simple interaction of the bot using mock data we shifted to using MongoDB for storing our credentials, configurations and keys. The provisioning of the instances was done on AWS and the configuration of the stack was done using the Chef. This was implemented through the Chef servers using the cookbooks available. Finally we deployed our bot on an AWS instance and configured the same using Ansible.</p>

#### Some key points during this process:<br>
<p>Being an environment provisioning bot the project not only helped us to develop our software development but also our DevOps concepts from the start. The testing of the bot helped us learn how to interact with multiple instance providers such as AWS and Digital Ocean. We also tried various NLP libraries to make our bot more intelligent, may of which were npm libraries but finally decided on Witai which is a highly updated and reputed library. Choosing the semi-structured format of MongoDB was also a decision we made which we felt best fitted our requirements. Finally for the deployment of the final application we felt that Ansible is the most reliable and efficient way of deploying our application on an AWS instance.<p>

#### Problems you met and how did you solve them:<br>
* One of the biggest problem we faced was with our earlier design decision where we directly sent the request to the chef server who provided an instance on AWS and then configured it. This was solved by changing the design such that the request by the user first created an AWS instance whose details were provided to the chef server to bootstrap a node using knife commands.
* Another problem was how to pass along the credentials of the users while interacting with the bot which was solved using json formatted files which were filled my users whose content was extracted and the file cleared after that.

#### Valuable things you have learnt from this project:<br>
* The agile methodology that was followed during the entire development task was a great learning tool. We realised how things become much more easier with a team when such the agile process is followed.
* The project helped us learn a variety of tools which would help us in not only the software development cycle of a project but also the DevOps side.

## Limitations

* Limited to provisioning on AWS.
* Predefined technology stacks and software available for installation.


## Future Work

* Extend the provisioning to other cloud service providers. For e.g. Digital Ocean
* Support wide range of software to be installed. Extent provisioning of on the fly software packages.
* Provide a more secure way to handle service provider tokens.

## Demonstration Video [Link](https://youtu.be/AzfSQY2slm4?list=PLwmjVRRFEyJBHnXTYjiCU_K2LWgS93Q_Q)

# Envoprov - Environment Provisioning Assistant bot

## Team

* Aniket Patel (apatel10)
* Gaurav Aradhye (garadhy)
* Kartikeya Pharasi (kpharas)
* Shruti Kuber (skuber)
* Subodh Dharmadhikari (skuber)


## Problem

Often creation of environments for different type of deployments such as production, testing, development, staging is a painstakingly long and manual process. In addition to this, if the deployment consists of a particular technology stack having multiple interconnected components, the configuration of such components has to be done by a knowledgeable person.

Also, configuration of the different components of technology stack is manual process and can induce some errors, thus delaying the deployment. By automating this process, the entire process will be error free and faster.

## Solution

EnvoProv is a conversational bot which will assist the user to provision the machines on Amazon Web Services.

It will assist the user by creating and provisioning of required machines with desired technology stack like LAMP and MEAN. It will reply with the details of machine. Since we are using AWS, it will reply you back with the information like

<pre>
Instance Id : i-9a9a9a99a9a
Public DNS Name: ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com
Public IP: xxx.xxx.xxx.xxx
</pre>

This information will be helpful in accessing the machines for future use.

The bot thus, makes life easier for user to automate the process to create and install the software required and in less amount of time than the manual process. 

The target audience we intend to cover with this bot can be a student who wants to go through less steps in creation, installation of softwares and mainitainance of any VM for academic purpose. It can also be used by a System Administrator, where he can request a sinlge VM on demand for his work or provision a cluster of VM based on demands of project for testing or new developemnt environment.

## Primary Features

* Automated Cloud VM provisioning.
* Installation of requested software/ technology stack
* Ready-to-Deploy scripts for installation of bot.
* Integrate the bot with help of slackapp with any team.
* Easy to enter credentials of VM provider, use file upload feature to perform this action. User need not enter the credentials.

## Reflection on Development process and project

## Limitations

* Limited to provisioning on AWS.
* Predefined technology stacks and software available for installation.


## Future Work

* Extend the provisioning to other cloud service providers. For e.g. Digital Ocean
* Support wide range of software to be installed. Extent provisioning of on the fly software packages.
* Provide a more secure way to handle service provider tokens. 

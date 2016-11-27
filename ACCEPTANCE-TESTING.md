###Acceptance Testing

####Pre-requisites:

To enable the bot to create infrastructure for you, you will need to have following details ready for you (required only the first time).

1. AWS ACCESS KEY ID and SECRET ACCESS KEY. These details should be present in the file named `aws_credentials.json`.

	<pre>
	{
  		"AWSAccessKeyId": "",
  		"AWSSecretKey": ""
	}
	</pre>
2. A fresh ssh keypair (or already configured with AWS). You must use the private key from this keypair to connect manually to the VMs created by the bot.
3. AWS configuration file with following JSON format:
	<pre>
	{
	   "image-id": "ami-2d39803a", //default ami-2d39803a (ubuntu 16.04)
  		"region": "" , // default: us-east-1
	   "instance-type": "", //default: t2.micro
  		"ssh-user": "" //default: ubuntu (this has to be as per the image)
	}
	</pre>
	
	Please note that the name of this file must be aws.json.
	
4. The bot will provide you link to download above files and then you can just fill up your own data and re-upload the file back to the bot.


####USE CASES
<ul>
<li>Our bot responds to coordial messages such as `"hi"`, `"how're you"`, `"Good morning"`	 and it also recognizes your name! Try it out before going for below use cases.</li>

<li>At any point in time if you want to start the conversation from start, then respond to bot using `bye`, it will throw you out of current conversation.</li>
</ul>

**1. Create a single VM**

<ul>
<li> Start with typing any of following `Create an instance for me`, `create a VM for me`, `deploy a VM for me` or any slight variation of this, and bot will understand.</li><br/>

<li> If you have not previously uploaded AWS configuration file, then the bot will send you link to download the file format and you can fill up details and upload the file back.<br/><br/>
There is default configuration present in the file. If you want to use the default configuration without making any changes, the just upload the file back to the bot without making any changes. 

From the next time onwards, bot won't ask for this as it saves your configuration information. </li><br/>
<li>Now bot will ask you about the technology stack you want to install on the VM. There are two options available - MEAN, LAMP. You have to reply back with one of these.</li><br/>

<li>After this, the bot will ask you for your AWS credentials in case you have not uploaded them previously. Similar to the configuration file, you have to download the empty crendetials file uploaded by the bot, fill in your details and then upload the file back to the bot. </li><br/>

<li>After this, the bot will ask you for your AWS private key file (We delete the file from Slack server so that there are no security issues). Please upload the file to the bot. It is advised to create a fresh keypair on your machine instead of sending existing keypair files.</li><br/>

<li>In next step, bot will ask you for the corresponding public key file. Please upload the public key file to the bot.</li><br/>

<li>After this step bot will create a new VM and return to you with following details:
<pre>
Instance Id : i-0a91aXXXXXXXXXXX
Public DNS Name: ec2-X-X-X-X.compute-1.amazonaws.com
Public IP: X.X.X.X
</pre>
</li>
</ul>
<br/>


**2. Create a Cluster**
<ul>
<li> Start with typing any of following `Create a cluster`, `Create Cluster` or any slight variation of this, and bot will understand.</li><br/>

<li> </li><br/>
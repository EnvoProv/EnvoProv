#Design Milestone

##Problem Statement
Often creation of environments for different type of deployments such as production, testing, development, staging is a painstakingly long and manual process. In addition to this, if the deployment consists of a particular technology stack having multiple interconnected components, the configuration of such components has to be done by a knowledgeable person.

Also, configuration of the different components of technology stack is manual process and can induce some errors, thus delaying the deployment. By automating this process, the entire process will be error free and faster.

##Bot Description (EnvoProv)
EnvoProv will be a conversational bot which takes inputs from user related to the resources that need to be provisioned and responds with the details of the created resources.

The EnvoProv will assist the user to provision an environment using cloud resources, install and interconnect technology stack components that he has requested to the bot. It will know the different cloud platforms the user has access to and the components of each technology stack beforehand. The EnvoProv can take inputs like type of environment (Production, Deployment, Testing, Development, Staging) and technology stacks (MEAN stack, LAMP stack, LEMP stack, and any user defined stack), cloud provider on which resources will be provisioned.

##Design Sketches
* **_Wireframe mockup for bot (envoprov) interactions._**

![Alt text] (https://github.com/EnvoProv/EnvoProv/blob/master/docs/bot-interaction.png?raw=true "Bot Interaction with User")

* **_Storyboard - Illustrating primary task of bot._**

![Alt text] (https://raw.githubusercontent.com/EnvoProv/EnvoProv/master/docs/storybook.png "Storyboard")

##Architecture Design

![Alt text] (https://github.com/EnvoProv/EnvoProv/blob/master/docs/software-architecture.jpg?raw=true "Software Architecture")

###Architecture Components

* **BotHost**  
The bot will be hosted on Slack.com. Slack.com will submit the requests to “Request Server” on behalf of the user. It will receive the response from the Request Server and convey it to the user.

* **Request Server**  
The server will host the scripts and logic for interaction with user. It will generate steps of VM creation, deployment of softwares requested by the user. The server will store the cloud provision service credentials temporarily for each user. 

* **Cloud Provisioning Service**  
Cloud services like AWS, DigitalOcean where the stack can be provisioned for the user. It will use user’s credentials for authorization/creation.

* **Package Manager**  
Will be using package manager like npm, yum or apt to download packages directly on provisioned hosts.

##Constraints
* Before giving any command to the bot the user has to upload her credentials to the BotHost. This file would be utilized by the Request Server to connect to the Cloud Provisioning Service. For AWS, it would be in the form of ‘AWS-credentials.csv’

* User should have sufficient credit and permissions for the resource creation on the cloud provider that he has requested resources from.

##Additional Patterns

* **Command Pattern**  
EnvoProv gives abstraction by providing a way of running multiple commands through a single interaction instead of having multiple interactions.

* **Abstract Factory Pattern**  
EnvoProv creates instances on different cloud services with wide range of products deployed on the server. The user is unaware of the underlying resources. The Request Server acts as an abstraction to create these instances on different services. 

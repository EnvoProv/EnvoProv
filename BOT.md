#Use Cases

##1. Create a Stack on Single VM on a Selected Cloud provider.

1. **Preconditions**  
User must have the credentials for the cloud account.

2. **Main Flow**  
User will request[S1] a stack along with the type of environment on a particular cloud provider [S2] [S3] [S4].

3. **Subflows** <br>
 [S1] Bot requests user for account credentials. <br>
 [S2] Bot will create a VM/cluster on selected cloud provider based on user requirements. <br>
 [S3] Bot will install all the dependencies and setup network on the VM/cluster. <br>
 [S4] Bot provides the details of the deployed VM to the user. <br>
4. **Alternate Flows** <br>
 [E1] Credentials are wrong. <br>
 [E2] User account doesn’t have enough resources to provision VMs. <br>
 [E3] Deployment failed. Cleans modified VMs and tries to redeploy. <br>

##2. User requests a Stack on Multiple VMs(cluster) on a Selected Cloud provider.

1. **Preconditions**  
User must possess the credentials of cloud service provider - AWS, DO etc.

2. **Main Flow**
  1. User requests a environment with number of virtual machines[S1] and technology stack[S2].
  2. EnvoProv replies back with the list of VMs allocated[S3].
  
3. **Subflows** <br>
 [S1] User will submit number of VMs and EnvoProv will create request instances of the specified number. <br>
 [S2] Request Server will resolve the dependencies of the requested technology stack and install them first. Then it will install the requested technology stack. <br>
 [S3] Request Server creates a list of the IP address of VM allocated and return back to the user. <br>


4. **Alternative Flows** <br>
 [E1] Credentials are expired or incorrect. <br>
 [E2] User doesn’t have access to the number of VMs requested. <br>
 [E3] The number of requested VMs are not available. <br>
 [E4] The third party package managers and hosts are not available / online. <br>


##3. User requests to delete an instance or a cluster of instances which are assigned an unique ID on creation. 

1. **Preconditions**  
  User must possess the credentials of cloud service provider - AWS, DO etc.

2. **Main flow** <br>
  User will request to delete an instance or a cluster of instance by mentioning the instance id[S1] that was assigned.
  
3. **Subflows** <br>
  [S1] If the user does not remember his/her instance ID they can request for a list of all the instances under their name. <br>
4. **Alternative Flows** <br>
  [E1] Credentials are expired or incorrect. <br>
	[E2] User doesn’t have access right of the VMs requested to be deleted. <br>

# Mocking Service Component
The mock data that is used for bot interaction is in bot_logic/mockdata.json

# Bot Implementation
1. Platform Used: Slack
2. Backend Implementation: Node.js
3. Testing Platform: Selenium in Java

# Task Tracking
[Link to task tracking worksheet](https://github.com/EnvoProv/EnvoProv/blob/master/WORKSHEET.md)

# Links of Screencasts:

#### Use Case 1 :
#####   Main Flow :      [Link](https://youtu.be/iVr9a_maj_U)    
#####   Alternate Flow : [Link](https://youtu.be/mPk_p-O1o5Q)

#### Use Case 2 : [Link](https://youtu.be/SUNay1bNkxY)

#### Use Case 3 : [Link](https://www.youtube.com/watch?v=F77IzumKjqY)


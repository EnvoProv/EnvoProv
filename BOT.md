#Use Cases

##1. Create a Stack on Selected Cloud.

1. **Preconditions**  
User must have the credentials for the cloud account.

2. **Main Flow**  
User will request a stack along with the type of environment on a particular cloud provider.

3. **Subflows**
  1. Bot requests user for account credentials.
  2. Bot will create a VM/cluster on selected cloud provider based on user requirements.
  3. Bot will install all the dependencies and setup network on the VM/cluster.
  4. Bot provides the details of the deployed VM to the user.
4. **Alternate Flows**
  1. Credentials are wrong.
  2. User account doesn’t have enough resources to provision VMs
  3. Deployment failed. Cleans modified VMs and tries to redeploy.

##2. User requests the number of VMs required for the deployment of the environment.

1. **Preconditions**  
User must possess the credentials of cloud service provider - AWS, DO etc.

2. **Main Flow**
  1. User requests a environment with number of virtual machines and technology stack
  2. EnvoProv replies back with the list of VMs allocated.
  
3. **Subflows**
  1. User will submit number of VMs and EnvoProv will create request instances of the specified number.
  2. Request Server will resolve the dependencies of the requested technology stack and install them first. Then it will install the requested technology stack
  3. Request Server creates a list of the IP address of VM allocated and return back to the user.

4. **Alternative Flows**
  1. Credentials are expired or incorrect.
  2. User doesn’t have access to the number of VMs requested.
  3. The number of requested VMs are not available.
  4. The third party package managers and hosts are not available / online.

##3. Exception thrown in case of wrong requirements entered. 

1. **Preconditions**  
  User must possess the credentials of cloud service provider - AWS, DO etc.

2. **Main flow**
  1. User will request a stack on a particular cloud provider with his specific requirements which are not handled by EnvoProv.
  2. Bot will return a message with options of configurations that it can provide.

3. **Alternative Flows**
  1. Credentials are wrong. Bot reports to user.
  2. User account doesn’t have enough resources to provision VMs.


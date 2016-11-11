### Milestone: SERVICE

#### We have implemented the 3 use cases:

* Creation of single instance
* Creation of cluster of instances
* Deletion of instance

#### Links to Screencast:

* Use case 2: [Link](https://www.youtube.com/watch?v=YjQ88XrsRo8)

* Use Case 1 and 3: [Link](https://youtu.be/6GohuMjB7OM)

Note for Use case 2: We have invalidated the keys displayed for the demo of use case 2.

#### Link to Updated Worksheet.md file
[Click Here](https://github.com/EnvoProv/EnvoProv/blob/Service/WORKSHEET.md)


#### Details:

We have used Chef as a backend for our bot which handles the infrastructure creation on different cloud providers for the bot. For the demo purpose, we have used the enterprize Chef Server available on manage.chef.io (Limited chookbooks). For the greater scale deployment, we can have out own Chef Server.

The chef_repo folder in the repository has the code required to fire the chef commands. The .chef repo inside parent repo has the chef configuration (knife.rb) and if you want to fire the chef commands, then you will have to store the private key related to your Chef account in .chef directory.

Apart from Chef, we have used Mongo DB as the intermediate database for out bot. All the details about instances and clusters, configurations, credentials are stored and read from the Mongo DB by the bot.

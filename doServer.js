var needle = require("needle");
var os   = require("os");
var fs = require('fs');
var sleep = require('sleep');

var config = {};
config.token = process.env.MY_TOKEN;

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

var client =
{

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[4493646],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		//console.log("Attempting to create "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	createInventory: function(dropletID, onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/droplets/" + dropletID, {headers:headers}, onResponse)
	},

};

// Creating the Droplet and automatically appending to the Inventory File

var name = "kpharas"+os.hostname();
var region = "nyc1"; 
var image = "ubuntu-14-04-x64";

client.createDroplet(name, region, image, function(err, resp, body)
{
	var data = resp.body;
	// StatusCode 202 - Means server accepted request.
	if(!err && resp.statusCode == 202)
	{
		console.log("Droplet successfully created");
	}

	console.log("Waiting for Droplet to initialize");
	sleep.sleep(60);

	client.createInventory(data.droplet.id, function(err, resp) {

		var res_data = resp.body;

		if( resp.headers )
			{
				console.log( "Calls remaining", resp.headers["ratelimit-remaining"] );
			}

		if( res_data.droplet.id)
			{	
				var ipAddr = res_data.droplet.networks.v4[0].ip_address;
				var dropletName = res_data.droplet.name;
				var inventoryContent = "[AppServer]\n" + dropletName + " ansible_ssh_host=" + ipAddr + " ansible_ssh_user=root\n";
				//console.log(inventoryContent);
			}

		fs.appendFile('inventory', inventoryContent, function(err) {
		if(err) throw err;
		console.log('The content was appended to the inventory file!');
		}); 
	});
});
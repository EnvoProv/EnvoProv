function areCredentialsPresent(username, credentials){
	var found = false;
	credentials.forEach(function(cred, index){
		if(cred.username === username)
			found = true;
	});

	return found;
}

function checkNewCredentials(username, password, newCredentials){
	var found = false;
	newCredentials.forEach(function(cred, index){
		if(cred.username === username && cred.password === password)
			found = true;
	});

	return found;
}

function getUserInstances(username, instances){
	for(inst in instances){
		if(instances[inst].User === username){
			console.log("in");
			return instances[inst].Instances;
		}
	}	
}

function canProvision(username, num_vms, credentials){
	var found = false;
	credentials.forEach(function(cred, index){
		if(cred.username === username && cred.aval_res >= num_vms)
			found = true;
	});

	return found;

}
exports.areCredentialsPresent = areCredentialsPresent;
exports.checkNewCredentials = checkNewCredentials;
exports.getUserInstances = getUserInstances;
exports.canProvision = canProvision;

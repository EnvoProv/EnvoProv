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

function checkInstances(username, instances, id_vms){
	var found = false;

	instances.forEach(function(inst, index) {
		if(inst.Name === id_vms && inst.User === username)
			found = true;
	});

	return found;
}


function getUserInstances(username, instances){
	var cluster = {};
	for(inst in instances){
		if(instances[inst].User === username){
			cluster.id = instances[inst].id;
			cluster.instances = instances[inst].Instances;
			return cluster;
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

/*function canDelete(username, num_vms, credentials){
	var found = false;
	credentials.forEach(function(cred, index){
		if(cred.username === username && cred.aval_instances === id_vms)
			found = true;
	});

	return found;

}*/

exports.areCredentialsPresent = areCredentialsPresent;
exports.checkNewCredentials = checkNewCredentials;
exports.getUserInstances = getUserInstances;
exports.canProvision = canProvision;
//exports.canDelete = canDelete;
exports.checkInstances = checkInstances;

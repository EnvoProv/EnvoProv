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
exports.areCredentialsPresent = areCredentialsPresent;
exports.checkNewCredentials = checkNewCredentials;

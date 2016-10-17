function areCredentialsPresent(username, credentials){
	var found = false;
	credentials.forEach(function(cred, index){
		console.log(username);
		console.log(cred.username);
		if(cred.username === username)
			found = true;
	});

	return found;
}

exports.areCredentialsPresent = areCredentialsPresent;

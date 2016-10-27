var MongoClient = require('mongodb').MongoClient

function getMongoConnection(db_processing) {
    var url = 'mongodb://localhost:27017/envoprov';
    MongoClient.connect(url, function(err, db) {
        if (err) console.log(err)
            //db = MongoClient.db('envoprov');
        db.createCollection('configurations', function(err, collection) {});
        db_processing(db);
    });
}

function isConfigurationInformationAvailable(userid, nextFunction) {
    getMongoConnection(function(db) {
        console.log("db: ", db)
        configurations = db.collection("configurations")
        configurations.find({
            userid: userid
        }).toArray(function(err, items) {
            if (items.length == 0) {
                db.close();
                nextFunction(false);
            } else {
                db.close();
                nextFunction(true);
            }
        })
    });
}


function areCredentialsPresent(username, credentials) {
    var found = false;
    credentials.forEach(function(cred, index) {
        if (cred.username === username)
            found = true;
    });

    return found;
}

function checkNewCredentials(username, password, newCredentials) {
    var found = false;
    newCredentials.forEach(function(cred, index) {
        if (cred.username === username && cred.password === password)
            found = true;
    });

    return found;
}

function checkInstances(username, instances, id_vms) {
    var found = false;

    instances.forEach(function(inst, index) {
        if (inst.Name === id_vms && inst.User === username)
            found = true;
    });

    return found;
}


function getUserInstances(username, instances) {
    var cluster = {};
    for (inst in instances) {
        if (instances[inst].User === username) {
            cluster.id = instances[inst].id;
            cluster.instances = instances[inst].Instances;
            return cluster;
        }
    }
}

function canProvision(username, num_vms, credentials) {
    var found = false;
    credentials.forEach(function(cred, index) {
        if (cred.username === username && cred.aval_res >= num_vms)
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

exports.isConfigurationInformationAvailable = isConfigurationInformationAvailable;
exports.areCredentialsPresent = areCredentialsPresent;
exports.checkNewCredentials = checkNewCredentials;
exports.getUserInstances = getUserInstances;
exports.canProvision = canProvision;
//exports.canDelete = canDelete;
exports.checkInstances = checkInstances;

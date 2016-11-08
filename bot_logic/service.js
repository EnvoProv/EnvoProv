var MongoClient = require('mongodb').MongoClient
var fs = require('fs')
var path = require('path');
var exec = require('child_process').execSync

function getMongoConnection(db_processing) {
    var url = 'mongodb://localhost:27017/envoprov';
    MongoClient.connect(url, function(err, db) {
        if (err) console.log(err)
            //db = MongoClient.db('envoprov');
        db.createCollection('configurations', function(err, collection) {
            if (err) console.log(err)
            db_processing(db);
        });
    });
}

function isConfigurationInformationAvailable(username, nextFunction) {
    getMongoConnection(function(db) {
        configurations = db.collection("configurations")
        configurations.find({
            userid: username
        }).toArray(function(err, items) {
            console.log(items)
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

function getUserConfiguration(username, nextFunction) {

    function getUserCredentials(db, configuration, username, callback) {
        credentials = db.collection("credentials")
        res = credentials.find({
            userid: username
        }).toArray(function(err, items_2) {
            db.close();
            credentials = items_2[0]
            configuration.AWSAccessKeyId = credentials.AWSAccessKeyId
            configuration.AWSSecretKey = credentials.AWSSecretKey
            console.log(configuration)
            nextFunction(configuration);
        })
    }
    getMongoConnection(function(db) {
        configurations = db.collection("configurations")
        configurations.find({
            userid: username
        }).toArray(function(err, items) {
            getUserCredentials(db, items[0], username, nextFunction);
        })
    });
}

function isAWSPrivateKeyPresent(username, callback) {
    getMongoConnection(function(db) {
        db.collection("private_keys").find({
            userid: username
        }).toArray(function(err, items) {
            if (items.length == 0) {
                callback(false, username);
            } else {
                callback(true, username);
            }
        })
    });
}

function storeAWSPrivateKeyInformation(username, filename, content, callback) {
    exec("mkdir -p " + __dirname + "/../private_keys/" + username, function(err, stdout, stderr) {
        console.log(err)
    });
    var private_key_path = __dirname + "/../private_keys/" + username + "/" + filename;
    fs.writeFile(private_key_path, content, function(err) {
        if (err) console.log(err)
        exec('chmod 600 ' + private_key_path + "; cp " + private_key_path + " ~/.ssh/");
        getMongoConnection(function(db) {
            private_key_json = {
                userid: username,
                path: private_key_path,
                file_name: filename.slice(0, -4)
            }
            configurations.userid = username;
            db.collection("private_keys").insert(private_key_json, function(err, result) {
                console.log("Inserted ", result)
                if (err) console.log(err)
                db.close();
                callback();
            });
        })
    })
}

function getPrivateKeyInformation(username, callback) {
    getMongoConnection(function(db) {
        db.collection("private_keys").find({
            userid: username
        }).toArray(function(err, items) {
            callback(items[0]);
        })
    });
}

function storeAWSConfigurationInformation(userid, configurations, nextFunction) {
    getMongoConnection(function(db) {
        //console.log(db)
        configurations.userid = userid;
        //console.log(configurations)
        db.collection("configurations").insert(configurations, function(err, result) {
            console.log("Inserted ", result)
            if (err) console.log(err)
            db.close();
            nextFunction();
        });
    })
}

function storeAWSCredentialInformation(userid, configurations, nextFunction) {
    getMongoConnection(function(db) {
        //console.log(db)
        configurations.userid = userid;
        //console.log(configurations)
        db.collection("credentials").insert(configurations, function(err, result) {
            console.log("Inserted ", result)
            if (err) console.log(err)
            db.close();
            nextFunction();
        });
    })
}

function areCredentialsPresent(username, nextFunction) {
    getMongoConnection(function(db) {
        console.log("Got mongo db connection")
        configurations = db.collection("credentials")
        configurations.find({
            userid: username
        }).toArray(function(err, items) {
            if (items.length == 0) {
                db.close();
                nextFunction(false, username);
            } else {
                db.close();
                nextFunction(true, username);
            }
        })
    });
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
exports.getPrivateKeyInformation = getPrivateKeyInformation
exports.getUserConfiguration = getUserConfiguration
exports.storeAWSCredentialInformation = storeAWSCredentialInformation
exports.storeAWSConfigurationInformation = storeAWSConfigurationInformation
exports.isConfigurationInformationAvailable = isConfigurationInformationAvailable
exports.storeAWSPrivateKeyInformation = storeAWSPrivateKeyInformation
exports.isAWSPrivateKeyPresent = isAWSPrivateKeyPresent
exports.areCredentialsPresent = areCredentialsPresent;
exports.checkNewCredentials = checkNewCredentials;
exports.getUserInstances = getUserInstances;
exports.canProvision = canProvision;
//exports.canDelete = canDelete;
exports.checkInstances = checkInstances;;
